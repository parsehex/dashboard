import { reactive } from 'vue';

interface State {
	chartsToExport: any[]; //chart config array
}

const state: State = reactive({
	chartsToExport: [],
});

export default state;
