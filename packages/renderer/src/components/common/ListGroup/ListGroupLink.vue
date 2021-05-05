<template>
	<router-link
		:class="[
			'list-group-item list-group-item-action',
			type ? 'list-group-item-' + type : '',
		]"
		:to="to"
	>
		<slot />
	</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';

export default defineComponent({
	name: 'ListGroupLink',
	props: {
		type: {
			type: String as () => BootstrapType,
			default: '',
		},
		to: {
			type: String,
			required: true,
		},
	},
	methods: {
		handleClick() {
			if (this.to) router.push(this.to);
		},
	},
});
</script>
