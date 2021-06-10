import { reactive } from 'vue';
import { useElectron } from './lib/use-electron';
import { log } from './lib/dev';

const { on, ipcRenderer } = useElectron();

interface State {
	chartsToExport: any[]; //chart config array
	dataFiles: FilesList;
	dir: string;
	version: string;
	isUpdateAvailable: boolean;
}

const state: State = reactive({
	chartsToExport: [],
	dataFiles: {
		'Weekly Payroll': { files: [] },
		'Weekly Transfers': { files: [] },
		'Revenue Per Session': { files: [] },
	},
	dir: '',
	version: '',
	isUpdateAvailable: false,
});

export default state;

(window as any).state = state;

(async () => {
	on('files', (e, files: FilesList) => {
		log('fs change', files);
		Object.assign(state, { dataFiles: files });
	});
	const files = await ipcRenderer.invoke('get-all-files');
	Object.assign(state, { dataFiles: files });

	on('dir', (e, d: string) => {
		state.dir = d;
	});
	state.dir = await ipcRenderer.invoke('get-dir');

	on('update-available', () => {
		state.isUpdateAvailable = true;
	});
	state.version = await ipcRenderer.invoke('get-version');

	// this doesn't need to be here
	on('help', () => {
		window.open('/help/index.html', '_blank');
	});
})();
