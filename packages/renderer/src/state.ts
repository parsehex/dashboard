import { reactive } from 'vue';
import { useElectron } from './lib/use-electron';

interface State {
	chartsToExport: any[]; //chart config array
	files: FilesList;
	dir: string;
}

const state: State = reactive({
	chartsToExport: [],
	files: {
		TNBillingStatement: [],
		TSheetsHoursReport: [],
		PayrollOptions: [],
	},
	dir: '',
});

export default state;

(async () => {
	await syncState();
})();
async function syncState() {
	const { ipcRenderer, addListener } = useElectron();
	try {
		const dir = await ipcRenderer.invoke('get-dir');
		state.dir = dir;
	} catch (e) {
		console.log('Error loading dir');
	}
	try {
		const files = await ipcRenderer.invoke('get-files');
		Object.assign(state.files, files);
	} catch (e) {
		console.log('Error loading files');
	}

	addListener('dir', (e, d: string) => {
		state.dir = d;
	});
	addListener('files', (e, files: FilesList) => {
		Object.assign(state.files, files);
		// console.log(clone(files));
	});
}

(window as any).state = state;
