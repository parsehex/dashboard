<template>
	<div class="content">
		<div>
			<choose-file file-type="TNBillingStatement" @pick-file="file = $event" />
		</div>
		<div v-if="loaded" class="container-container">
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
						file-name="Billing Transactions.xlsx"
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
import type { Report } from './ReportDef';
import { Columns, Presets } from './ReportDef';
import Spreadsheet from '@/components/Spreadsheet.vue';
import Chart from '@/components/Chart.vue';
import process from './process';
import { DataMode } from './data/table';
import ChooseFile from '@/components/ChooseFile.vue';
import Tabs from '@/components/common/Tabs.vue';
import { BlankBuffer } from '@/lib/const';

export default defineComponent({
	name: 'Billing',
	components: { Spreadsheet, ChooseFile, Chart, Tabs },
	data: () => {
		const report = {} as Report;
		const modes = Object.keys(Columns);
		for (const m of modes) {
			report[m] = [];
		}
		return {
			option: '',
			file: BlankBuffer,
			loaded: false,
			report,
			sheet: '% Collected' as DataMode,
		};
	},
	computed: {
		cols: () => Columns,
		presets: () => Presets,
	},
	watch: {
		file: {
			async handler() {
				console.log('d');
				if (this.file === BlankBuffer) return;
				this.report = await process(this.file);
				this.loaded = true;
			},
		},
	},
});
</script>
