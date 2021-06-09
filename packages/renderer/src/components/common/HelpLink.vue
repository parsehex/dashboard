<template>
	<a :href="link" target="_blank"><slot /></a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'HelpLink',
	props: {
		page: {
			type: String,
			required: true,
		},
	},
	computed: {
		link(): string {
			return '/help/' + this.page + '.html';
		},
	},
});
</script>
