<template>
	<btn type="info" :class="label ? '' : 'rounded'" :size="size" @click="onclick">
		<span v-if="label">{{ label }}</span>
		<icon v-else type="help-circle" :size="20" color="white" />
	</btn>
</template>

<script lang="ts">
import { useElectron } from '@/lib/use-electron';
import { defineComponent, PropType } from 'vue';

const { ipcRenderer } = useElectron();

export default defineComponent({
	name: 'HelpLink',
	props: {
		page: {
			type: String,
			default: '/',
		},
		label: {
			type: String,
		},
		size: {
			type: String as PropType<'' | 'sm' | 'lg' | 'xs'>,
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

<style scoped>
button {
	transition: background-color 0.3s;
}
button:hover {
	background-color: #007bff;
}
</style>
