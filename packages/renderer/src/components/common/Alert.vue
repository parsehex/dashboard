<template>
	<div :class="'alert alert-' + type" role="alert">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'Alert',
	props: {
		type: {
			type: String as PropType<BootstrapType>,
			required: true,
		},
	},
});
</script>
