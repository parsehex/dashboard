<template>
	<button type="button" :class="className">
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'Btn',
	props: {
		type: {
			type: String as PropType<BootstrapType>,
			required: true,
		},
		size: {
			type: String as PropType<'' | 'xs' | 'sm' | 'lg'>,
			required: false,
			default: '',
		},
		outline: { type: Boolean, required: false },
		centered: { type: Boolean, required: false },
	},
	computed: {
		className() {
			const { centered, outline, size, type } = this;
			let className = 'btn';

			className += ` btn-${outline ? 'outline-' : ''}${type}`;

			if (centered) {
				className += ' d-inline-flex';
				className += ' justify-content-center';
				className += ' align-items-center';
			}

			if (size) className += ' btn-' + size;

			return className;
		},
	},
});
</script>
