<template>
	<!-- eslint-disable vue/no-v-html feather-icons is pretty reputable -->
	<span v-html="icon"></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { icons } from 'feather-icons';

export default defineComponent({
	name: 'Icon',
	props: {
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
			default: 16,
		},
	},
	computed: {
		icon(): string {
			return icons[this.type].toSvg({
				class: 'm-1',
				height: this.size,
				width: this.size,
			});
		},
	},
});
</script>
