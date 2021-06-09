import { reactive } from 'vue';
import { useElectron } from './lib/use-electron';
import { log } from './lib/dev';

const { on, ipcRenderer } = useElectron();

interface State {
	chartsToExport: any[]; //chart config array
	dataFiles: FilesList;
	dir: string;
}

const state: State = reactive({
	chartsToExport: [],
	dataFiles: {
		'Weekly Payroll': { files: [] },
		'Weekly Transfers': { files: [] },
	},
	dir: '',
});

export default state;

(window as any).state = state;

(async () => {
	on('files', (e, files: FilesList) => {
		log('fs change', files);
		Object.assign(state, { dataFiles: files });
	});
	on('dir', (e, d: string) => {
		state.dir = d;
	});
	const files = await ipcRenderer.invoke('get-all-files');
	Object.assign(state, { dataFiles: files });
	state.dir = await ipcRenderer.invoke('get-dir');
})();
