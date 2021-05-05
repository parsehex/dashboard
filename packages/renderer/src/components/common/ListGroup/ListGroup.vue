<template>
	<div :class="['list-group', flush ? 'list-group-flush' : '']">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ListGroup',
	props: {
		flush: Boolean,
	},
});
</script>
