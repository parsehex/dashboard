<template>
	Sheet:
	<select @input="handleInput">
		<option v-for="s in sheets" :key="s">{{ s }}</option>
	</select>
	<div ref="table" />
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
			// reactiveData: true,
		});
	},
	methods: {
		handleInput($event: Event) {
			this.$emit('update:sheet', ($event.target as HTMLSelectElement).value);
		},
	},
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
	color: #42b983;
}
</style>
