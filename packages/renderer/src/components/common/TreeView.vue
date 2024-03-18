<template>
	<ul class="tree-view">
		<li v-for="branch in tree" :key="id + '/' + (branch.id || branch.href)">
			<router-link v-if="branch?.href" :to="id + '/' + branch.href">
				{{ branch.text }}
			</router-link>
			<span v-else :class="branchLabelClass" @click="toggle">
				{{ branch.text }}
			</span>
			<tree-view
				v-if="expanded && branch?.children && branch.children.length > 0"
				:id="id + '/' + branch.id"
				class="branch"
				:tree="branch.children || []"
			/>
		</li>
	</ul>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'TreeView',
	props: {
		// eslint-disable-next-line no-undef
		tree: { type: Object as PropType<ITreeView>, required: true },
		id: {
			type: String,
			default: '',
		},
	},
	data: () => ({ expanded: true }),
	computed: {
		branchLabelClass() {
			let c = 'branch-label';
			if (this.expanded) c += ' caret-down';
			return c;
		},
	},
	methods: {
		toggle() {
			// don't allow toggling root
			if (!this.id) return;

			this.expanded = !this.expanded;
		},
	},
});
</script>

<style lang="scss">
ul.tree-view {
	list-style-type: none;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: start;

	&:not(.branch) {
		// root
		margin: 0;
		padding: 0;

		& > li {
			margin: 0;
		}
	}
	&.branch .branch-label {
		cursor: pointer;
		user-select: none;
		&::before {
			content: '\25B6';
			color: black;
			display: inline-block;
			margin-right: 6px;
		}
		&.caret-down::before {
			transform: rotate(90deg);
		}
	}
}
</style>
