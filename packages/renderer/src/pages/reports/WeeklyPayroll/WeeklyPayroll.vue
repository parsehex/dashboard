<template>
	<div class="content">
		<div>
			<choose-file
				file-type-label="Billing Transactions"
				@pick-file="billingFile = $event"
			/>
			<choose-file
				file-type-label="Hours Report"
				@pick-file="hoursFile = $event"
			/>
			<choose-file
				file-type-label="Payroll Options"
				@pick-file="optionsFile = $event"
			/>
			<btn type="success" @click="go">Go</btn>
		</div>
		<div v-if="file">
			<spreadsheet
				v-model:sheet="sheet"
				:data="report"
				file-name="Payroll Hours Breakdown.xlsx"
				:columns="cols"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import processPayroll, { Columns, Report } from './process';
import Spreadsheet from '@/components/Spreadsheet.vue';
import ChooseFile from '@/components/ChooseFile.vue';

export default defineComponent({
	name: 'Payroll',
	components: { Spreadsheet, ChooseFile },
	data: () => {
		return {
			file: '',
			billingFile: '',
			optionsFile: '',
			hoursFile: '',
			limitsFile: '',
			report: {
				Employees: [],
			} as Report,
			sheet: 'Employees' as keyof Report,
		};
	},
	computed: {
		cols: () => Columns,
	},
	methods: {
		async go(file: string) {
			this.file = file;
			this.report = await processPayroll({
				billing: this.billingFile,
				hours: this.hoursFile,
				options: this.optionsFile,
			});
		},
	},
});
</script>
