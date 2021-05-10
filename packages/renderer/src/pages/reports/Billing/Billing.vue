<template>
	Choose a Billing Transactions file:
	<select v-model="option">
		<option value="pick">Browse...</option>
		<option v-for="o in fileHistory" :key="o.value" :value="o.value">
			{{ o.label }}
		</option>
	</select>
	<btn type="primary" @click="go">Go</btn>
	<span v-if="loaded">
		Download:
		<btn type="success" @click="download">Spreadsheet</btn>
		<btn type="success" @click="download">Chart</btn>
		<spreadsheet v-model:sheet="sheet" :data="report" />
		<chart :data="chart.data" :title="chart.title" :type="chart.type" />
	</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import xlsx from 'xlsx';
import { pickFile, recentlyOpenedFiles, saveFile } from '@/lib/io';
import type { Report } from './process';
import processPayroll from './process';
import Spreadsheet from '@/components/Spreadsheet.vue';
import Chart from '@/components/Chart.vue';
import type { ChartData, ChartTypeRegistry } from 'chart.js';
import { useElectron } from '@/lib/use-electron';

export default defineComponent({
	name: 'Billing',
	components: { Spreadsheet, Chart },
	data: () => {
		const hist = recentlyOpenedFiles();
		return {
			option: '',
			file: '',
			hist,
			loaded: false,
			report: {
				Employees: [],
				Totals: [],
			} as Report,
			sheet: 'Employees' as keyof Report,
		};
	},
	computed: {
		fileHistory() {
			const { path } = useElectron();
			const hist: string[] = this.hist;
			return hist.map((f) => {
				const p = path.parse(f);
				return { value: f, label: p.base };
			});
		},
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
	mounted() {
		if (this.fileHistory.length === 0) return;
		this.option = this.fileHistory[this.fileHistory.length - 1].value;
	},
	methods: {
		async go() {
			this.loaded = false;
			if (this.option === 'pick') {
				await this.chooseFile();
			} else {
				this.file = this.option;
				await this.processHistory();
			}
			this.loaded = true;
		},
		async chooseFile() {
			this.file = (await pickFile(true)) || '';
			if (!this.file) return;
			this.hist = recentlyOpenedFiles();
			this.processHistory();
		},
		async processHistory() {
			this.report = await processPayroll(this.file);
		},
		async download() {
			const report = await processPayroll(this.file);
			const wb = xlsx.utils.book_new();
			const s1 = xlsx.utils.json_to_sheet(report.Employees);
			const s2 = xlsx.utils.json_to_sheet(report.Totals);
			xlsx.utils.book_append_sheet(wb, s1, 'Employees');
			xlsx.utils.book_append_sheet(wb, s2, 'Totals');

			const d = xlsx.write(wb, { bookType: 'xlsx', type: 'file' });
			await saveFile(d);
		},
	},
});
</script>
