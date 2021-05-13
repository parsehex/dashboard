<template>
	<choose-file file-type-label="Payroll History" @update:file="go" />
	<span v-if="file">
		<spreadsheet
			v-model:sheet="sheet"
			:data="report"
			file-name="Payroll Hours Breakdown.xlsx"
			:columns="cols"
		/>
		<hr />
		<chart :data="chart.data" :title="chart.title" :type="chart.type" />
	</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Columns, Report } from './process';
import processPayroll from './process';
import Spreadsheet from '@/components/Spreadsheet.vue';
import Chart from '@/components/Chart.vue';
import type { ChartData, ChartTypeRegistry } from 'chart.js';
import ChooseFile from '@/components/ChooseFile.vue';

export default defineComponent({
	name: 'Payroll',
	components: { Spreadsheet, Chart, ChooseFile },
	data: () => {
		return {
			file: '',
			report: {
				Employees: [],
				Totals: [],
			} as Report,
			sheet: 'Employees' as keyof Report,
		};
	},
	computed: {
		cols: () => Columns,
		chart(): {
			data: ChartData;
			type: keyof ChartTypeRegistry;
			title: string;
		} {
			const MainCol = {
				Employees: 'Name',
				Totals: 'Period',
			};
			const labels = Object.values(this.report[this.sheet]).map(
				(v) => v[MainCol[this.sheet]]
			);
			const data = {
				labels,
				datasets: [
					{
						label: 'Admin',
						data: Object.values(this.report[this.sheet]).map(
							(v) => v.Admin
						) as number[],
						backgroundColor: '#2196F3',
					},
					{
						label: 'Clin',
						data: Object.values(this.report[this.sheet]).map(
							(v) => v.Clin
						) as number[],
						backgroundColor: '#FF9800',
					},
				],
			};
			return { data, type: 'bar', title: 'Payroll hours by Admin vs Clin' };
		},
	},
	methods: {
		async go(file: string) {
			this.file = file;
			this.report = await processPayroll(this.file);
		},
	},
});
</script>
