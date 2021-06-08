<template>
	<div class="content report">
		<div class="choose-report">
			<div :class="['select', reports.length > 0 ? '' : 'hidden']">
				<label for="reports">Open Report</label>
				<select id="reports" v-model="selectedReport">
					<option v-for="o in reports" :key="o">{{ o }}</option>
				</select>
				<btn type="primary" size="sm" @click="openReportFolder">
					Open folder
				</btn>
			</div>
			<div class="create-report">
				<input v-model="reportNameInput" type="text" />
				<btn type="success" @click="create">Create Report</btn>
			</div>
		</div>
		<div v-if="selectedReport" class="files">
			<choose-file
				v-for="f in requiredFiles"
				:key="reportType + '-' + f.key"
				:report="reportType"
				:report-name="selectedReport"
				:file-type="f.type"
				:common-file="f.common"
				@pick-file="files[f.key] = $event"
			/>
		</div>
		<div v-if="selectedReport && loaded" class="container-fluid">
			<tabs :tab-list="tabList">
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
						:columns="columnDefs"
					/>
				</div>
				<div
					v-if="chartPresets"
					id="chart"
					class="tab-pane"
					role="tabpanel"
					aria-labelledby="chart-tab"
				>
					<chart :report="report" :sheet="sheet" :presets="chartPresets" />
				</div>
			</tabs>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Spreadsheet from '@/components/Spreadsheet.vue';
import ChooseFile from '@/components/ChooseFile.vue';
import Chart from '@/components/Chart.vue';
import Tabs from '@/components/common/Tabs.vue';
import { clone, now, pad } from '@/lib/utils';
import { BlankBuffer } from '@/lib/const';
import state from '@/state';
import { useElectron } from '@/lib/use-electron';
const { mkdirp, resolveFile, openFolder } = useElectron();

interface FilesObj {
	[f: string]: Buffer;
}

export default defineComponent({
	name: 'Report',
	components: { Spreadsheet, ChooseFile, Chart, Tabs },
	props: {
		reportType: {
			type: String as PropType<ReportType>,
			required: true,
		},
		requiredFiles: {
			type: Array as PropType<ReportDep[]>,
			required: true,
		},
		processor: {
			type: Function as PropType<(files: FilesObj) => Promise<GenericObject>>,
			required: true,
		},
		chartPresets: {
			type: Object as PropType<ChartPresets>,
			default: undefined,
		},
		defaultReport: {
			type: Object as PropType<GenericObject>,
			required: true,
		},
		columnDefs: {
			type: Object as PropType<TabulatorSpreadsheetColumnDefs>,
			required: true,
		},
	},
	data: (props) => {
		const files: GenericObject = {};
		const lsKey = props.reportType + '-last';

		const report = clone(props.defaultReport);
		const sheets = Object.keys(report);
		const keys = props.requiredFiles.map((v) => v.key);
		for (const k of keys) {
			files[k] = BlankBuffer;
		}

		return {
			files,
			lsKey,
			selectedReport: localStorage.getItem(lsKey) || '',
			reportNameInput: '',
			loaded: false,
			report,
			sheet: sheets[0],
		};
	},
	computed: {
		sheetTitle(): string {
			const n = now();
			const y = n.getFullYear();
			const d = pad(n.getDate(), 2);
			const m = pad(n.getMonth() + 1, 2);
			return `${this.reportType} ${m}-${d}-${y}.csv`;
		},
		reports(): string[] {
			return Object.keys(state.dataFiles[this.reportType]).filter(
				(v) => v !== 'files'
			);
		},
		tabList() {
			const tabs = ['spreadsheet'];
			if (this.chartPresets) tabs.push('chart');
			return tabs;
		},
		depKeys(): string[] {
			return this.requiredFiles.map((v) => v.key);
		},
	},
	watch: {
		files: {
			handler() {
				const keys = this.depKeys;
				let ready = true;
				for (const k of keys) {
					if (this.files[k] === BlankBuffer) {
						ready = false;
						break;
					}
				}
				if (ready) this.go();
			},
			deep: true,
		},
		selectedReport() {
			localStorage.setItem(this.lsKey, this.selectedReport);
			this.loaded = false;
		},
	},
	methods: {
		async go() {
			this.report = await this.processor(this.files);
			this.sheet = Object.keys(this.report)[0];
			this.loaded = true;
		},
		async create() {
			const p = resolveFile({
				report: this.reportType,
				reportName: this.reportNameInput,
			});
			await mkdirp(p);
			this.selectedReport = this.reportNameInput;
			this.openReportFolder(p);
		},
		async openReportFolder(p = '') {
			if (!p)
				p = resolveFile({
					report: this.reportType,
					reportName: this.selectedReport,
				});
			await openFolder(p);
		},
	},
});
</script>

<style lang="scss">
.choose-report {
	display: flex;
	justify-content: space-around;

	.select {
		select {
			padding: 2px;
			margin-left: 5px;
		}
		&.hidden {
			visibility: hidden;
		}
	}
	.create-report {
		margin-left: 5em;
	}
}
.files {
	display: flex;
	flex-direction: row;
	justify-content: center;

	* {
		margin: 0 0.3em;
	}
}
</style>
