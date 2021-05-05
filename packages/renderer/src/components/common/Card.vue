<template>
	<div :class="className">
		<div v-if="$slots.header" class="card-header">
			<slot name="header" />
		</div>
		<div v-if="$slots.title || $slots.text" class="card-body">
			<h5 v-if="$slots.title" class="card-title">
				<slot name="title" />
			</h5>
			<p v-if="$slots.text" class="card-text">
				<slot name="text" />
			</p>
		</div>
		<div v-if="actions?.length > 0" class="card-body">
			<a
				v-for="a in actions"
				:key="a.label"
				href="#"
				class="card-link"
				@click="a.callback"
			>
				{{ a.label }}
			</a>
		</div>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Card',
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
		actions: {
			type: Array as PropType<ActionButton[]>,
			required: false,
			// eslint-disable-next-line vue/require-valid-default-prop
			default: [],
		},
	},
	computed: {
		className() {
			const { size, type } = this;
			let className = 'card';

			className += ` bg-${type}`;

			if (type !== 'light') {
				className += ' text-white';
			}

			if (size) className += ' btn-' + size;

			return className;
		},
	},
});
</script>

<style lang="scss">
div.card {
	div.card-body {
		padding: 0.65rem 1.25rem;
	}
}
</style>
