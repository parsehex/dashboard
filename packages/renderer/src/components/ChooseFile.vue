<template>
	<div>
		Choose
		<select @change="updateOption">
			<option value="" disabled selected>{{ fileTypeLabel }} file</option>
			<option value="pick">Browse...</option>
			<option v-for="o in fileHistory" :key="o.value" :value="o.value">
				{{ o.label }}
			</option>
		</select>
		<!-- <dropdown :actions="dropdownActions" :btn-label="fileTypeLabel" /> -->
		<!-- <btn type="primary" @click="go">Go</btn> -->
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { pickFile, recentlyOpenedFiles } from '@/lib/io';
import { useElectron } from '@/lib/use-electron';
// import Dropdown from './common/Dropdown.vue';

export default defineComponent({
	name: 'ChooseFile',
	// components: { Dropdown },
	props: {
		fileTypeLabel: {
			type: String,
			required: true,
		},
	},
	emits: ['pick-file'],
	data: () => ({
		hist: recentlyOpenedFiles(),
		option: '',
	}),
	computed: {
		fileHistory() {
			const { path } = useElectron();
			const hist: string[] = this.hist;
			return hist.map((f) => {
				const p = path.parse(f);
				return { value: f, label: p.base };
			});
		},
		dropdownActions(): DropdownActions {
			const actions: DropdownActions = [
				{
					label: 'Browse...',
					onClick: () => {
						this.option = 'pick';
						this.go();
					},
				},
			];

			return actions.concat(
				this.fileHistory.map((f) => ({
					label: f.label,
					onClick: () => {
						this.option = f.value;
						this.go();
					},
				}))
			);
		},
	},
	mounted() {
		// if (this.fileHistory.length === 0) return;
		// this.option = this.fileHistory[this.fileHistory.length - 1].value;
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
			this.hist = recentlyOpenedFiles();
			this.$emit('pick-file', file);
		},
	},
});
</script>
