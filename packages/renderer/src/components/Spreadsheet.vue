<template>
	<div class="spreadsheet">
		<span
			v-for="s in sheets"
			:key="s"
			:class="{
				sheet: true,
				active: sheet === s,
			}"
			@click="changeSheet(s)"
		>
			{{ s }}
		</span>
		<div ref="table" />
	</div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { computed, defineComponent } from 'vue';
import Tabulator from 'tabulator-tables';

export default defineComponent({
	name: 'Spreadsheet',
	props: {
		data: { type: Object as PropType<SpreadsheetData>, required: true },
		sheet: {
			type: String as PropType<keyof SpreadsheetData>,
			required: true,
		},
	},
	emits: ['update:sheet'],
	setup(props) {
		const sheets = computed(() => Object.keys(props.data));
		return { sheets };
	},
	data: () => ({
		table: null as typeof Tabulator,
	}),
	updated() {
		this.table?.clearData();
		this.table?.setData(this.data[this.sheet]);
		this.table?.redraw(true);
	},
	mounted() {
		const table = this.$refs['table'] as HTMLDivElement;
		this.table = new Tabulator(table, {
			maxHeight: Math.floor(window.innerHeight / 2) - table.offsetTop, // this enables the Virtual DOM
			data: this.data[this.sheet],
			layout: 'fitColumns',
			autoResize: true,
			autoColumns: true,
		});
	},
	methods: {
		changeSheet(sheet: string) {
			this.$emit('update:sheet', sheet);
		},
	},
});
</script>

<style lang="scss">
.spreadsheet {
	.sheet {
		padding: 6px;
		border: 1px solid gray;
		margin-bottom: 2px;
		cursor: pointer;
		display: inline-block;

		&:first-of-type {
			border-top-left-radius: 5px;
			border-bottom-left-radius: 5px;
		}
		&:last-of-type {
			border-top-right-radius: 5px;
			border-bottom-right-radius: 5px;
		}

		&.active {
			font-weight: bold;
		}
	}
}
</style>
