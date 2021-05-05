<template>
	<div
		:class="[
			'list-group-item',
			type ? 'list-group-item-' + type : '',
			action ? 'list-group-item-action' : '',
		]"
	>
		<slot />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ListGroupItem',
	props: {
		type: {
			type: String as () => BootstrapType,
			default: '',
		},
		action: {
			type: Boolean,
			default: false,
		},
	},
});
</script>
