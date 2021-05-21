<template>
	<div class="content">
		<div>
			<choose-file
				file-type="TNBillingStatement"
				@pick-file="files.billing = $event"
			/>
			<choose-file
				file-type="TSheetsHoursReport"
				@pick-file="files.hours = $event"
			/>
			<choose-file
				file-type="PayrollOptions"
				@pick-file="files.options = $event"
			/>
		</div>
		<div v-if="loaded" class="container-fluid">
			<tabs :tab-list="['Spreadsheet', 'Chart']">
				<div
					id="spreadsheet"
					class="tab-pane active"
					role="tabpanel"
					aria-labelledby="spreadsheet-tab"
				>
					<spreadsheet
						v-model:sheet="sheet"
						:data="report"
						:file-name="sheetTitle"
						:columns="cols"
					/>
				</div>
				<div
					id="chart"
					class="tab-pane"
					role="tabpanel"
					aria-labelledby="chart-tab"
				>
					<chart :report="report" :sheet="sheet" :presets="presets" />
				</div>
			</tabs>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import processPayroll, { Columns, Report } from './process';
import Spreadsheet from '@/components/Spreadsheet.vue';
import ChooseFile from '@/components/ChooseFile.vue';
import Chart from '@/components/Chart.vue';
import Tabs from '@/components/common/Tabs.vue';
import { now, pad } from '@/lib/utils';
import { Presets } from './ReportDef';

export default defineComponent({
	name: 'Payroll',
	components: { Spreadsheet, ChooseFile, Chart, Tabs },
	data: () => {
		return {
			files: {
				billing: '',
				hours: '',
				options: '',
			},
			loaded: false,
			report: {
				Employees: [],
			} as Report,
			sheet: 'Employees' as keyof Report,
		};
	},
	computed: {
		cols: () => Columns,
		presets: () => Presets,
		sheetTitle: () => {
			const n = now();
			const y = n.getFullYear();
			const d = pad(n.getDate(), 2);
			const m = pad(n.getMonth() + 1, 2);
			return `Weekly Payroll ${m}-${d}-${y}.xlsx`;
		},
	},
	watch: {
		files: {
			handler() {
				if (this.files.billing && this.files.hours && this.files.options) {
					this.go();
				}
			},
			deep: true,
		},
	},
	methods: {
		async go() {
			this.report = await processPayroll(this.files);
			this.loaded = true;
		},
	},
});
</script>
