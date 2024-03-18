<template>
	<div class="btn-group my-2">
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
		<ul
			v-click-outside="close"
			class="dropdown-menu"
			:aria-labelledby="btnLabel + '-dropdown'"
		>
			<li
				v-for="a in actions"
				:key="btnLabel + '-' + a.label"
				class="dropdown-item"
				:class="{ 'border-top': a.label === '----' }"
				@click.prevent="handleClick(a)"
			>
				<a href="#" v-if="a.label !== '----'">
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
	data: (): { dropdown: Dropdown | null } => ({
		dropdown: null,
	}),
	mounted() {
		const ref = this.$refs['btn'] as any;
		this.dropdown = new Dropdown(ref.$el);
	},
	methods: {
		close() {
			this.dropdown?.hide();
		},
		handleClick(action: DropdownActions[0]) {
			if (action.label !== '----') {
				action.onClick();
				this.close();
			}
		},
	},
});
</script>

<style scoped>
.border-top {
	border-top: 1px solid #ccc;
}
</style>
