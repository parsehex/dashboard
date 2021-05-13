<template>
	<div>
		Choose a {{ fileTypeLabel }} file:
		<select v-model="option">
			<option value="pick">Browse...</option>
			<option v-for="o in fileHistory" :key="o.value" :value="o.value">
				{{ o.label }}
			</option>
		</select>
		<btn type="primary" @click="go">Go</btn>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { pickFile, recentlyOpenedFiles } from '@/lib/io';
import { useElectron } from '@/lib/use-electron';

export default defineComponent({
	name: 'ChooseFile',
	props: {
		fileTypeLabel: {
			type: String,
			required: true,
		},
	},
	emits: ['update:file'],
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
	},
	mounted() {
		if (this.fileHistory.length === 0) return;
		this.option = this.fileHistory[this.fileHistory.length - 1].value;
	},
	methods: {
		async go() {
			let file: string;
			if (this.option === 'pick') {
				file = (await pickFile(true)) || '';
			} else {
				file = this.option;
			}
			this.hist = recentlyOpenedFiles();
			this.$emit('update:file', file);
		},
	},
});
</script>
