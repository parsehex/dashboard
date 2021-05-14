<template>
	<div class="content">
		<choose-file file-type-label="Billing Transactions" @pick-file="go" />
		<div v-if="file">
			<spreadsheet
				v-model:sheet="sheet"
				:data="report"
				file-name="Billing Transactions.xlsx"
				:columns="cols"
			/>
			<chart :report="report" :sheet="sheet" :presets="presets" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Report } from './ReportDef';
import { Columns, Presets } from './ReportDef';
import Spreadsheet from '@/components/Spreadsheet.vue';
import Chart from '@/components/Chart.vue';
import process from './process';
import { DataMode } from './data/table';
import ChooseFile from '@/components/ChooseFile.vue';

export default defineComponent({
	name: 'Billing',
	components: { Spreadsheet, ChooseFile, Chart },
	data: () => {
		const report = {} as Report;
		const modes = Object.keys(Columns);
		for (const m of modes) {
			report[m] = [];
		}
		return {
			option: '',
			file: '',
			report,
			sheet: '% Collected' as DataMode,
		};
	},
	computed: {
		cols: () => Columns,
		presets: () => Presets,
	},
	methods: {
		async go(file: string) {
			this.file = file;
			this.report = await process(this.file);
		},
	},
});
</script>
