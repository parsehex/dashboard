<template>
	<svg
		class="m-1"
		:width="size"
		:height="size"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<use :xlink:href="'/feather-sprite.svg#' + type" />
	</svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Icon',
	props: {
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: 32,
		},
	},
});
</script>
