<template>
	<report
		:report-type="ReportName"
		:required-files="RequiredFiles"
		:processor="Processor"
		:chart-presets="Presets"
		:default-report="DefaultReport"
		:column-defs="Columns"
		:option-defs="Options"
	/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as Def from './ReportDef';
import ReportVue from '@/components/Report.vue';

export default defineComponent({
	name: Def.ReportName.replace(/[ ]/g, ''),
	components: { Report: ReportVue },
	data: () => Def,
});
</script>
