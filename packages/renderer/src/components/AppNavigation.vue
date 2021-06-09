<template>
	<container class="app-nav" fluid>
		<div v-if="dir" class="items">
			<tree-view :tree="tree" />
			<btn type="warning" size="sm" @click="reload">
				<icon type="refresh-cw" />
			</btn>
			<a href="/help/index.html" class="btn btn-info btn-sm" target="_blank">
				Help
			</a>
			<btn v-if="pdfCharts.length > 0" type="success">
				Save {{ pdfCharts.length }} Chart{{ pdfCharts.length > 1 ? 's' : '' }}
				as PDF
			</btn>
		</div>
		<div class="dir input-group mb-3">
			<input
				:value="dir"
				type="text"
				class="form-control"
				placeholder="Data folder"
				aria-label="Recipient's username"
				aria-describedby="basic-addon2"
				disabled
			/>
			<div class="input-group-append">
				<span id="basic-addon2" class="input-group-text">
					<btn :type="dir ? 'info' : 'primary'" size="sm" @click="pickDir">
						<icon type="folder-plus" />
					</btn>
				</span>
			</div>
		</div>
	</container>
</template>

<script lang="ts">
import { useElectron } from '@/lib/use-electron';
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
				text: 'Weekly Transfers',
				href: 'weekly-transfers',
			},
			// {
			// 	text: 'Payroll Hours Breakdown',
			// 	href: 'payroll-hours',
			// },
			{
				text: 'Revenue Per Session',
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
		dir: () => state.dir,
	},
	methods: {
		reload: () => {
			window.location.reload();
		},
		pickDir: async () => {
			await useElectron().pickDir();
		},
	},
});
</script>

<style lang="scss" scoped>
.app-nav {
	.input-group-text {
		padding-top: 0 !important;
		padding-bottom: 0 !important;
	}
	.dir {
		margin-top: 1rem;
		.btn {
			padding: 0;
		}
	}
}
</style>
