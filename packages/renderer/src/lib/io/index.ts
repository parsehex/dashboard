import type { Chart } from 'chart.js';
import * as xlsx from 'xlsx';
import { useElectron } from '../use-electron';
import { getLSKey, recentlyOpenedFiles } from './file-history';

export const FileFilters: { [ext: string]: Electron.FileFilter } = {
	png: { name: 'PNG files', extensions: ['png'] },
	xlsx: { name: 'XLSX files', extensions: ['xlsx'] },
};

export async function chartToBuffer(chart: Chart) {
	const url = chart.toBase64Image('image/png', 1);
	const response = await fetch(url);
	const file = await response.arrayBuffer();
	return useElectron().bufferFrom(file);
}

interface PickFileOptions {
	/** If provided, then this key will be used for storing file list */
	rememberKey?: SupportedFileType;
	title?: string;
}
export async function pickFile({ rememberKey, title }: PickFileOptions) {
	const { dialog, exists } = useElectron();
	const options: Electron.OpenDialogOptions = {
		properties: ['openFile'],
	};
	if (title) options.title = title;
	const f = await dialog.showOpenDialog(options);
	if (f.canceled || !f.filePaths.length) return false;

	if (rememberKey) {
		const lsKey = getLSKey(rememberKey);
		const hist = recentlyOpenedFiles(rememberKey);
		hist.push(f.filePaths[0]);
		for (const p of hist) {
			// remove broken paths
			if (!(await exists(p))) {
				const i = hist.indexOf(p);
				hist.splice(i, 1);
			}
		}
		localStorage.setItem(lsKey, JSON.stringify(hist));
	}
	return f.filePaths[0];
}
export async function pickDir() {
	const { dialog, ipcRenderer } = useElectron();
	const options: Electron.OpenDialogOptions = {
		properties: ['openDirectory'],
	};

	const f = await dialog.showOpenDialog(options);
	if (f.canceled || !f.filePaths.length) return false;

	await ipcRenderer.invoke('set-dir', f.filePaths[0]);
}
export async function saveFile(d: Buffer, fileName: string) {
	const { ipcRenderer } = useElectron();
	await ipcRenderer.invoke('save-as', { fileName, d });
}

interface Options<Col> {
	file: string;
	sheetName: string;
	header?: xlsx.Sheet2JSONOpts['header'];
	sort?: keyof Col | ((a: Col, b: Col) => number);
}

export async function loadSpreadsheetFile<ColumnType>({
	file,
	sheetName,
	header,
	sort,
}: Options<ColumnType>): Promise<ColumnType[]> {
	const { readFile } = useElectron();
	const f = await readFile(file);
	const wb = xlsx.read(f, { type: 'array' });

	let sheetIndex = wb.SheetNames.indexOf(sheetName);
	if (sheetIndex === -1) {
		if (wb.SheetNames.length === 1) sheetIndex = 0;
		else {
			throw new Error('Invalid sheetName');
		}
	}

	const data: ColumnType[] = xlsx.utils.sheet_to_json(
		wb.Sheets[wb.SheetNames[sheetIndex]],
		{ header }
	);

	if (typeof sort === 'string') {
		// @ts-ignore
		data.sort((a, b) => a[sort] - b[sort]);
	} else if (typeof sort === 'function') {
		data.sort(sort);
	}

	return data;
}
