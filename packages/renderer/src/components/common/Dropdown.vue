<template>
	<div class="btn-group">
		<btn
			:id="btnLabel + '-dropdown'"
			ref="btn"
			class="dropdown-toggle"
			type="secondary"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			data-bs-auto-close="true"
		>
			{{ btnLabel }}
		</btn>
		<ul class="dropdown-menu" :aria-labelledby="btnLabel + '-dropdown'">
			<li
				v-for="a in actions"
				:key="btnLabel + '-' + a.label"
				class="dropdown-item"
				@click.prevent="a.onClick"
			>
				<a href="#">
					{{ a.label }}
				</a>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Dropdown } from 'bootstrap';

export default defineComponent({
	name: 'Dropdown',
	props: {
		actions: {
			type: Array as PropType<DropdownActions>,
			required: true,
		},
		btnLabel: { type: String, required: true },
	},
	mounted() {
		const ref = this.$refs['btn'] as any;
		new Dropdown(ref.$el);
	},
});
</script>

<style lang="scss">
// .dropdown {
// 	ul a {
// 		cursor: default;
// 	}
// }
</style>
