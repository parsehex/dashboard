<template>
	<div :class="['container' + (fluid ? '-fluid' : '')]"><slot /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Container',
	props: {
		fluid: { type: Boolean, default: false },
	},
});
</script>

<style lang="scss"></style>
