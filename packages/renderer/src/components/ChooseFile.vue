<template>
	<div>
		{{ fileTypeLabel }}:
		<dropdown :actions="dropdownActions" :btn-label="label || 'Choose file'" />
		<a
			v-if="fileError.shown"
			class="btn btn-link btn-danger text-white"
			:href="'/help/' + fileType + '.html'"
			target="_blank"
		>
			{{ fileError.label }}
		</a>
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
import { validateFile } from '@/lib/io/validate-file';
import { addToHistory } from '@/lib/io/file-history';
const { path, readFile } = useElectron();

export default defineComponent({
	name: 'ChooseFile',
	components: { Dropdown },
	props: {
		fileType: {
			type: String as PropType<SupportedFileType>,
			required: true,
		},
	},
	emits: ['pick-file'],
	data: (props) => ({
		hist: recentlyOpenedFiles(props.fileType),
		option: '',
		label: '',
		fileData: null as any,
		fileError: {
			shown: false,
			label: 'Wrong File Type',
			message: 'bad file type',
		},
	}),
	computed: {
		fileTypeLabel(): string | string[] {
			// @ts-ignore: vetur error (probably bug)
			return FileTypes.dictionary[this.fileType].name.print;
		},
		fileHistory(): { value: string; label: string }[] {
			// @ts-ignore: this error is incorrect (this.hist is a getter not a function)
			return this.hist.map((f) => {
				const p = path.parse(f);
				return { value: f, label: p.base };
			});
		},
		dropdownActions(): DropdownActions {
			const actions: DropdownActions = this.fileHistory.map((f) => ({
				label: f.label,
				onClick: async () => {
					this.option = f.value;
					this.label = f.label;
					await this.loadFile();
					this.go();
				},
			}));
			actions.push({
				label: 'Browse...',
				onClick: async () => {
					this.option = 'pick';
					await this.pickFile();
				},
			});
			return actions;
		},
	},
	async mounted() {
		await this.updateHistory();
		if (this.hist.length > 0) {
			this.dropdownActions[0].onClick();
		}
	},
	methods: {
		popError(e: string) {
			this.fileError.label = e;
			this.fileError.shown = true;
		},
		async updateHistory() {
			this.hist = await recentlyOpenedFilesClean(this.fileType);
		},
		async pickFile() {
			const pickedFile = await pickFile({
				// rememberKey: this.fileType,
				title: `Choose a ${this.fileTypeLabel} file`,
			});
			if (pickedFile === false) return;
			const p = path.parse(pickedFile);
			this.label = p.base;
			this.option = pickedFile;

			await this.loadFile();
			if (!this.validateFile()) {
				this.popError('Wrong File Type');
				this.label = '';
				this.option = '';
				this.fileData = '';
				return;
			}
			this.fileError.shown = false;
			addToHistory(this.fileType, pickedFile);

			await this.updateHistory();
		},
		async loadFile() {
			this.fileData = await readFile(this.option);
		},
		go() {
			this.$emit('pick-file', this.fileData);
		},
		validateFile() {
			return validateFile(this.fileType, this.fileData);
		},
	},
});
</script>
