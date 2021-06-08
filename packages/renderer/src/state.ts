import { reactive } from 'vue';
import { useElectron } from './lib/use-electron';
import { log } from './lib/dev';

const { on, ipcRenderer } = useElectron();

interface State {
	chartsToExport: any[]; //chart config array
	dataFiles: FilesList;
}

const state: State = reactive({
	chartsToExport: [],
	dataFiles: {
		'Weekly Payroll': { files: [] },
		'Weekly Transfers': { files: [] },
	},
});

export default state;

(window as any).state = state;

(async () => {
	on('files', (e, files: FilesList) => {
		log('fs change', files);
		Object.assign(state, { dataFiles: files });
	});
	const files = await ipcRenderer.invoke('get-files');
	Object.assign(state, { dataFiles: files });
})();
