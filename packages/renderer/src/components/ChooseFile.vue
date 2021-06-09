<template>
	<div class="choose-file">
		<div class="label">
			<span>{{ fileTypeLabel }}</span>
			<help-link
				v-if="helpPage"
				class="btn btn-link btn-sm btn-info text-white"
				:page="helpPage"
				title="Learn more about this file"
			>
				?
			</help-link>
		</div>
		<dropdown :actions="dropdownActions" :btn-label="label" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { pickFile } from '@/lib/io';
import {
	recentlyOpenedFiles,
	recentlyOpenedFilesClean,
} from '@/lib/io/file-history';
import { useElectron } from '@/lib/use-electron';
import Dropdown from './common/Dropdown.vue';
import FileTypes from '../../../main/src/file-types';
import { validateFile } from '@/lib/validate-file';
import { addToHistory } from '@/lib/io/file-history';
import { BlankBuffer } from '@/lib/const';
import state from '@/state';
const { path, readFile, resolveFile, move, copy } = useElectron();

interface FileObject {
	/** The absolute path to the file */
	value: string;
	/** The file name + ext */
	label: string;
}
export default defineComponent({
	name: 'ChooseFile',
	components: { Dropdown },
	props: {
		fileType: {
			type: String as PropType<SupportedFileType>,
			required: true,
		},
		report: {
			type: String as PropType<ReportType>,
			required: true,
		},
		reportName: {
			type: String,
			default: '',
		},
		commonFile: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['pick-file', '404'],
	data: (props) => ({
		hist: recentlyOpenedFiles(props.fileType),
		option: '',
		fileData: BlankBuffer,
		fileError: {
			shown: false,
			label: 'Wrong File Type',
			message: 'bad file type',
		},
	}),
	computed: {
		helpPage(): string | undefined {
			return FileTypes.dictionary[this.fileType].help;
		},
		label() {
			if (!this.option) return 'Choose file';
			const p = path.parse(this.option);
			return p.base;
		},
		bestFileMatch() {
			// rank each file option based on heuristics
			// return best match
			const results: { file: FileObject; score: number }[] =
				this.fileHistory.map((file) => ({
					file,
					score: +validateFile(this.fileType, file.label),
				}));
			results.sort((a, b) => b.score - a.score);
			return results[0]?.score > 0 ? results[0] : undefined;
		},
		fileTypeLabel(): string | string[] {
			// @ts-ignore: vetur error (probably bug)
			return FileTypes.dictionary[this.fileType].name.print;
		},
		fileHistory(): FileObject[] {
			let files: string[] = [];
			if (!this.reportName || this.commonFile) {
				files = state.dataFiles[this.report].files;
			} else {
				files = state.dataFiles[this.report][this.reportName];
			}
			if (!files) return [];

			const results = files.map((f) => {
				const p = path.parse(f);
				return {
					value: resolveFile({
						report: this.report,
						file: f,
						reportName: this.commonFile ? undefined : this.reportName,
					}),
					label: p.base,
				};
			});
			return results;
		},
		dropdownActions(): DropdownActions {
			const actions: DropdownActions = this.fileHistory.map((f) => ({
				label: f.label,
				onClick: async () => {
					this.option = f.value;
					await this.loadFile();
					this.emitPick();
				},
			}));
			actions.push({
				label: 'Browse & Move file...',
				onClick: async () => await this.pickAndMoveFile(),
			});
			actions.push({
				label: 'Browse & Copy file...',
				onClick: async () => await this.pickAndCopyFile(),
			});
			return actions;
		},
	},
	async mounted() {
		if (!this.bestFileMatch) {
			this.resetAll();
			return;
		}

		if (!this.bestFileMatch) return;

		const f = this.bestFileMatch.file;
		this.option = f.value;
		await this.loadFile();
		if (await this.loadFile()) this.emitPick();
	},
	async updated() {
		if (this.option && this.fileHistory.length === 0) {
			this.resetAll();
			return;
		}

		const bestMatch = this.bestFileMatch;
		if (!bestMatch?.file.value || bestMatch.file.value === this.option) return;

		this.option = bestMatch.file.value;

		if (await this.loadFile()) this.emitPick();
	},
	methods: {
		async loadFile() {
			try {
				this.fileData = await readFile(this.option);
				const isCorrectContent = validateFile(this.fileType, this.fileData);
				// console.log(isCorrectContent);
				if (!isCorrectContent) throw 'Wrong file type';
				this.resetError();
				return true;
			} catch (e) {
				// console.log(e);
				this.resetAll();
				this.errorWrongFileType();
				this.$emit('404');
				return false;
			}
		},
		showError(e: string) {
			this.fileError.label = e;
			this.fileError.shown = true;
		},
		resetOption() {
			this.option = '';
			this.fileData = BlankBuffer;
		},
		resetError() {
			this.fileError.label = '';
			this.fileError.shown = false;
		},
		resetAll() {
			this.resetOption();
			this.resetError();
		},
		errorFileNotFound() {
			this.showError('File Not Found');
		},
		errorWrongFileType() {
			this.showError('Wrong File Type');
		},
		async updateHistory() {
			this.hist = await recentlyOpenedFilesClean(this.fileType);
		},
		fileDestination() {
			// where the file should go if the user browses for a file
			const reportName = this.commonFile ? undefined : this.reportName;
			return resolveFile({ report: this.report, reportName });
		},
		async pickAndMoveFile() {
			let pickedFile = await pickFile({
				// rememberKey: this.fileType,
				title: `Choose a ${this.fileTypeLabel} file`,
			});
			if (pickedFile === false) return;

			const d = await readFile(pickedFile);
			const isCorrectContent = validateFile(this.fileType, d);
			if (!isCorrectContent) return;

			const filename = path.parse(pickedFile).base;
			const dest = path.join(this.fileDestination(), filename);
			await move(pickedFile, dest);
			pickedFile = dest;

			this.option = pickedFile;

			if (await this.loadFile()) this.emitPick();
			addToHistory(this.fileType, pickedFile);

			await this.updateHistory();
		},
		async pickAndCopyFile() {
			let pickedFile = await pickFile({
				// rememberKey: this.fileType,
				title: `Choose a ${this.fileTypeLabel} file`,
			});
			if (pickedFile === false) return;

			const d = await readFile(pickedFile);
			const isCorrectContent = validateFile(this.fileType, d);
			if (!isCorrectContent) return;

			const filename = path.parse(pickedFile).base;
			const dest = path.join(this.fileDestination(), filename);
			await copy(pickedFile, dest);
			pickedFile = dest;

			this.option = pickedFile;

			if (await this.loadFile()) this.emitPick();
			addToHistory(this.fileType, pickedFile);

			await this.updateHistory();
		},

		emitPick() {
			if (this.fileData === BlankBuffer) return;
			this.$emit('pick-file', this.fileData);
		},
	},
});
</script>

<style lang="scss">
.choose-file {
	display: inline-flex;
	flex-direction: column;

	.label {
		display: flex;
	}
}
</style>
