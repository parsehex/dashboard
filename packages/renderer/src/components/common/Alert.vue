<template>
	<div :class="'alert alert-' + type" role="alert">
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Alert',
	props: {
		type: {
			type: String as () => BootstrapType,
			required: true,
		},
	},
});
</script>
