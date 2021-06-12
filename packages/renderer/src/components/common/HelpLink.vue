<template>
	<btn type="info" @click="onclick"><slot /></btn>
</template>

<script lang="ts">
import { useElectron } from '@/lib/use-electron';
import { defineComponent } from 'vue';

const { ipcRenderer } = useElectron();

export default defineComponent({
	name: 'HelpLink',
	props: {
		page: {
			type: String,
			default: '',
		},
	},
	methods: {
		onclick() {
			ipcRenderer.invoke('help', this.page);
		},
	},
});
</script>
