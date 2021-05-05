<template>
	<div :class="['col', centered ? 'd-flex justify-content-center' : '']">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Column',
	props: {
		centered: { type: Boolean, default: false },
	},
});
</script>
