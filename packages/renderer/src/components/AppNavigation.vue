<template>
	<container fluid>
		<tree-view :tree="tree" />
		<btn v-if="pdfCharts.length > 0" type="success">
			Save {{ pdfCharts.length }} Chart{{ pdfCharts.length > 1 ? 's' : '' }} as
			PDF
		</btn>
	</container>
</template>

<script lang="ts">
import state from '@/state';
import { defineComponent } from 'vue';
import TreeView from './common/TreeView.vue';

const tree: TreeView = [
	{
		text: 'Reports',
		id: 'report',
		children: [
			{
				text: 'Weekly Payroll',
				href: 'payroll',
			},
			{
				text: 'Payroll Hours Breakdown',
				href: 'payroll-hours',
			},
			{
				text: 'TN Billing Transactions',
				href: 'billing-tn',
			},
		],
	},
];

export default defineComponent({
	name: 'AppNavigation',
	components: { TreeView },
	data: () => ({ tree }),
	computed: {
		pdfCharts: () => state.chartsToExport,
	},
});
</script>

<style scoped>
nav {
	display: flex;
	gap: 1em;
	justify-content: center;
}
</style>
