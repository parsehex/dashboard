<template>
	<div class="content report">
		<div v-if="!isOnlyCommon" class="choose-report">
			<div :class="['select', reports.length > 0 ? '' : 'hidden']">
				<label for="reports">Report:</label>
				<select id="reports" v-model="selectedReport">
					<option v-for="o in reports" :key="id(o)">{{ o }}</option>
				</select>
				<btn
					class="mx-2"
					type="info"
					size="sm"
					title="Open this report folder"
					@click="openReportFolder()"
				>
					Open Folder
				</btn>
			</div>
			<div class="create-report">
				<btn class="mx-1" type="success" @click="create">Create New Report</btn>
			</div>
		</div>
		<div v-if="optionDefs" class="opts">
			<div v-for="o in optionDefs" :key="id(o.key)">
				<label :for="id(o.key)">{{ o.label }}</label>
				<input :id="id(o.key)" v-model="opts[o.key]" :type="o.type" />
			</div>
		</div>
		<div v-if="selectedReport || isOnlyCommon" class="files">
			<btn
				v-if="isOnlyCommon"
				type="primary"
				size="sm"
				@click="openReportFolder()"
			>
				Open Folder
			</btn>
			<choose-file
				v-for="f in requiredFiles"
				:key="id(f.key)"
				:report="reportType"
				:report-name="selectedReport"
				:file-type="f.type"
				:common-file="f.common || isOnlyCommon"
				@pick-file="files[f.key] = $event"
			/>
		</div>
		<div v-if="shouldShowReport" class="container-fluid">
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
						:download-to="reportFolder"
						:report-type="reportType"
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
import { clone, now, pad, strToId } from '@/lib/utils';
import { BlankBuffer } from '@/lib/const';
import state from '@/state';
import { useElectron } from '@/lib/use-electron';
import format from 'date-fns/format';
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
			type: Function as PropType<
				(
					files: FilesObj,
					options?: GenericObject,
					reportName?: string
				) => Promise<GenericObject>
			>,
			required: true,
		},
		defaultReport: {
			type: Object as PropType<GenericObject>,
			required: true,
		},
		columnDefs: {
			type: Object as PropType<TabulatorSpreadsheetColumnDefs>,
			required: true,
		},
		chartPresets: {
			type: Object as PropType<ChartPresets>,
			default: undefined,
		},
		optionDefs: {
			type: Array as PropType<ReportOptions>,
			default: undefined,
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

		const DefaultOptions = Object.fromEntries(
			(props.optionDefs || []).map((v) => [v.key, ''])
		);

		const lsKeyOptions = props.reportType + '-options';
		const lsOptions = localStorage.getItem(lsKeyOptions);
		let options: any;
		if (lsOptions) options = JSON.parse(lsOptions);

		return {
			files,
			lsKey,
			selectedReport: localStorage.getItem(lsKey) || '',
			loaded: false,
			report,
			sheet: sheets[0],
			...(props.optionDefs && {
				opts: options || DefaultOptions,
			}),
		};
	},
	computed: {
		isOnlyCommon() {
			// if (this.requiredFiles.length === 1) return true;

			for (const f of this.requiredFiles) {
				if (!f.common) return false;
			}
			return true;
		},
		shouldShowReport(): boolean {
			return (!!this.selectedReport || this.isOnlyCommon) && this.loaded;
		},
		sheetTitle(): string {
			const n = now();
			const y = n.getFullYear();
			const d = pad(n.getDate(), 2);
			const m = pad(n.getMonth() + 1, 2);
			return `${this.reportType} ${m}-${d}-${y}.xlsx`;
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
		reportFolder(): string {
			const reportName = this.isOnlyCommon ? undefined : this.selectedReport;
			return resolveFile({
				report: this.reportType,
				reportName,
			});
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
		opts: {
			handler() {
				const lsKey = this.reportType + '-options';
				const s = JSON.stringify(this.opts);
				localStorage.setItem(lsKey, s);
				this.go();
			},
			deep: true,
		},
		selectedReport() {
			localStorage.setItem(this.lsKey, this.selectedReport);
			this.loaded = false;
		},
	},
	mounted() {
		const lsVal = localStorage.getItem(this.lsKey);
		if (lsVal === null && this.reports.length > 0) {
			this.selectedReport = this.reports[this.reports.length - 1];
		}
	},
	methods: {
		async go() {
			this.report = await this.processor(
				this.files,
				this.opts,
				this.selectedReport
			);
			this.sheet = Object.keys(this.report)[0];
			this.loaded = true;
		},
		async create() {
			const name = format(new Date(), 'yy-MM-dd');
			if (this.reports.includes(name)) {
				this.selectedReport = name;
				return;
			}
			const p = resolveFile({
				report: this.reportType,
				reportName: name,
			});
			await mkdirp(p);
			this.selectedReport = name;
			this.openReportFolder(p);
		},
		async openReportFolder(p = '') {
			await openFolder(p || this.reportFolder);
		},

		id(...parts: string[]) {
			return [strToId(this.reportType)].concat(parts).join('-');
		},
	},
});
</script>

<style lang="scss">
.report {
	.choose-report {
		display: flex;
		justify-content: space-between;

		.select {
			margin-left: 5em;
			select {
				padding: 2px;
				margin-left: 5px;
			}
		}
		.create-report {
			margin-left: 5em;
		}
	}
	.opts {
		display: flex;
		flex-direction: row;
		justify-content: center;
		column-gap: 2em;
	}
	.files {
		display: flex;
		flex-direction: row;
		justify-content: center;

		& > *,
		& > .choose-file > .label > * {
			margin: 0 0.25em;
		}
	}
}
</style>
