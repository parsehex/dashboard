<template>
	<div v-if="!isSingleFile">
		{{ fileTypeLabel }}:
		<dropdown :actions="dropdownActions" :btn-label="label || 'Choose file'" />
	</div>
	<div v-else>
		{{ label }}
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { pickFile } from '@/lib/io';
import { useElectron } from '@/lib/use-electron';
import Dropdown from './common/Dropdown.vue';
import state from '@/state';
import FileTypes from '../../../main/src/file-types';
const { path } = useElectron();

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
	data: () => ({
		option: '',
		label: '',
	}),
	computed: {
		fileTypeLabel(): string | string[] {
			// @ts-ignore: vetur error (probably bug)
			return FileTypes.dictionary[this.fileType].name.print;
		},
		f(): string | string[] {
			return state.files[this.fileType];
		},
		hist(): string[] {
			if (this.isSingleFile) return [];
			if (!(this.fileType in state.files)) return [];
			// @ts-ignore: casting to string doesn't work
			return state.files[this.fileType];
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
				onClick: () => {
					this.option = f.value;
					this.label = f.label;
					this.go();
				},
			}));
			actions.push({
				label: 'Browse...',
				onClick: () => {
					this.option = 'pick';
					this.go();
				},
			});
			return actions;
		},
		isSingleFile(): boolean {
			const f = state.files[this.fileType];
			return typeof f === 'string';
		},
	},
	mounted() {
		if (this.isSingleFile) {
			const f = this.f as string;
			const p = path.parse(f);
			this.option = f;
			this.label = p.base;
			this.go();
		}
	},
	methods: {
		updateOption(e: Event) {
			const target = e.target as HTMLSelectElement;
			this.option = target.value;
			if (!this.option) return;
			this.go();
		},
		async go() {
			let file: string;
			if (this.option === 'pick') {
				const pickedFile = await pickFile({
					remember: true,
					title: `Choose a ${this.fileTypeLabel} file`,
				});
				if (pickedFile === false) return;
				file = pickedFile;
			} else {
				file = this.option;
			}
			this.option = file;
			this.$emit('pick-file', file);
		},
	},
});
</script>
