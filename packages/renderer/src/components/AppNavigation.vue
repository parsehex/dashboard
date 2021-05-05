<template>
	<container fluid>
		<tree-view :tree="tree" />
	</container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TreeView from './common/TreeView.vue';

const tree: TreeView = [
	{
		text: 'Reports',
		id: 'report',
		children: [
			{
				text: 'Payroll Hours Breakdown',
				href: 'payroll-hours',
			},
		],
	},
	// {
	// 	text: '',
	// 	id: '_',
	// 	children: [
	// 		{
	// 			text: 'Export Charts',
	// 			href: 'export-charts',
	// 		},
	// 	],
	// },
];

export default defineComponent({
	name: 'AppNavigation',
	components: { TreeView },
	data: () => ({ tree }),
});
</script>

<style scoped>
nav {
	display: flex;
	gap: 1em;
	justify-content: center;
}
</style>
