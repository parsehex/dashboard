<template>
	<div v-if="presets[sheet].length" class="chart-container">
		<canvas ref="chart" />
		<div class="controls">
			<select v-model="preset">
				<option v-for="(p, i) in presets[sheet]" :key="`${i}-${p.title}`">
					{{ p.title }}
				</option>
			</select>
			<btn type="success" @click="download">Download Chart</btn>
			<btn type="success" @click="addToPDF">Add chart to PDF</btn>
		</div>
	</div>
</template>

<script lang="ts">
import { nextTick, PropType } from 'vue';
import { defineComponent } from 'vue';
import state from '@/state';
import Chart from 'chart.js/auto';
import type { ChartConfiguration, Chart as C } from 'chart.js';
import { chartToBuffer, saveFile } from '@/lib/io';
// import { clone } from '@/lib/utils';

export default defineComponent({
	name: 'Chart',
	props: {
		presets: {
			type: Object as PropType<ChartPresets>,
			required: true,
		},
		report: {
			type: Object as PropType<SpreadsheetData>,
			required: true,
		},
		sheet: {
			type: String as PropType<keyof SpreadsheetData>,
			required: true,
		},
	},
	data: (props) => {
		const presets = props.presets[props.sheet];
		let preset = '';
		if (presets && presets.length > 0) preset = presets[0].title;

		return {
			// @ts-ignore
			chart: null as C,
			chartConfig: {} as any,
			datasets: [],
			preset,
		};
	},
	computed: {
		activePreset(): ChartComponentConfigPreset | null {
			for (const p of this.presets[this.sheet]) {
				if (p.title === this.preset) return p;
			}
			return null;
		},
		chartData(): any {
			const preset = this.activePreset;
			if (!preset) return {};
			// console.log('ding');

			const { datasets, mainColumn } = preset;
			const reportData = Object.values(this.report[this.sheet]);

			const data: any = {
				labels: reportData.map((v) => v[mainColumn]),
				datasets: [],
			};
			// console.log(reportData);
			for (const d of datasets) {
				let backgroundColor: any = d.color;
				if (d.color === '--AUTO--') {
					backgroundColor = data.labels.map(() => randomColor());
				}
				data.datasets.push({
					label: d.label || d.key,
					data: reportData.map((v) => v[d.key]) as number[],
					backgroundColor,
				});
			}
			return { data, title: preset.title };
		},
	},
	updated() {
		// when props are updated, check whether the selected preset is valid
		// if invalid and there are presets, set the selected preset to first preset
		const { preset, sheet } = this;
		const presets = this.presets[sheet];
		if (!presets || presets.length === 0) return;

		console.log(presets);
		let invalidPreset = true;
		for (const p of presets) {
			if (p.title !== preset) continue;
			invalidPreset = false;
		}

		if (invalidPreset) {
			console.log('Invalid chart preset, resetting');
			this.preset = presets[0].title;
		}

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
			const presets = this.presets[this.sheet];
			if (!presets || presets.length === 0) return;

			const activePreset = this.activePreset;
			if (!activePreset) return;

			if (this.chart) this.chart.destroy();

			const canvas = this.$refs['chart'] as HTMLCanvasElement;
			canvas.style.minHeight = '400px';
			// canvas.style.maxHeight = '100%';
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

			let stacked = false;
			let type: any = activePreset.type;
			if (type.includes('-stacked')) {
				type = type.replace('-stacked', '');
				stacked = true;
			}

			const config: ChartConfiguration = {
				type: type,
				data: this.chartData.data,
				options: {
					responsive: true,
				},
			};
			if (stacked) {
				config.options!.scales = {
					x: {
						stacked: true,
					},
					y: {
						stacked: true,
					},
				};
			}
			if (activePreset.title) {
				config.options!.plugins = {
					title: {
						display: true,
						text: activePreset.title,
					},
				};
			}

			this.chartConfig = config;

			nextTick(() => {
				try {
					this.chart = new Chart(ctx, config);
				} catch (e) {
					console.log('Failed creating chart (Did the chart change anyway?)');
				}
			});
		},
	},
});
function randomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
</script>

<style lang="scss">
.chart-container {
	max-height: 50vh;
	position: relative;
	// border: 1px solid;
	// border-radius: 3px;
}
</style>
