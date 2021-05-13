<template>
	<div class="chart-container">
		<div class="chart">
			<canvas ref="chart" />
		</div>
		<div class="controls">
			<btn type="success" @click="download">Download Chart</btn>
			<btn type="success" @click="addToPDF">Add chart to PDF</btn>
		</div>
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import state from '@/state';
import Chart from 'chart.js/auto';
import type {
	ChartTypeRegistry,
	ChartData,
	ChartConfiguration,
	Chart as C,
} from 'chart.js';
import { chartToBuffer, saveFile } from '@/lib/io';

export default defineComponent({
	name: 'Chart',
	props: {
		data: {
			type: Object as PropType<ChartData>,
			required: true,
		},
		type: { type: String as PropType<keyof ChartTypeRegistry>, required: true },
		title: { type: String, default: '' },
	},
	data: () => ({
		// @ts-ignore
		chart: null as C,
		chartConfig: {} as any,
	}),
	updated() {
		this.createChart();
	},
	mounted() {
		this.createChart();
	},
	methods: {
		async download() {
			const image = await chartToBuffer(this.chart);
			await saveFile(image, 'chart.png');
		},
		addToPDF() {
			state.chartsToExport.push(this.chartConfig);
		},
		createChart() {
			if (this.chart) this.chart.destroy();

			const canvas = this.$refs['chart'] as HTMLCanvasElement;
			canvas.height = 75;
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

			const config: ChartConfiguration = {
				type: this.type,
				data: this.data,
				options: {
					responsive: true,
					scales: {
						x: {
							stacked: true,
						},
						y: {
							stacked: true,
						},
					},
				},
			};
			if (this.title) {
				config.options!.plugins = {
					title: {
						display: true,
						text: this.title,
					},
				};
			}
			this.chart = new Chart(ctx, config);
			this.chartConfig = config;
		},
	},
});
</script>

<style lang="scss">
.chart-container {
	max-height: 50vh;
	position: relative;
	// border: 1px solid;
	// border-radius: 3px;
}
</style>
