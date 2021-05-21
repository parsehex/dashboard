import type { Chart } from 'chart.js';
import * as xlsx from 'xlsx';
import { useElectron } from './use-electron';

const LS_KEY = 'file-history';
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

export function recentlyOpenedFiles(): string[] {
	const ls = localStorage.getItem(LS_KEY);
	return ls ? JSON.parse(ls) : [];
}

interface PickFileOptions {
	remember?: boolean;
	title?: string;
}
export async function pickFile({ remember, title }: PickFileOptions) {
	const { dialog } = useElectron();
	const options: Electron.OpenDialogOptions = {
		properties: ['openFile'],
	};
	if (title) options.title = title;
	const f = await dialog.showOpenDialog(options);
	if (f.canceled || !f.filePaths.length) return false;

	if (remember) {
		const ls = localStorage.getItem(LS_KEY);
		const hist: string[] = ls ? JSON.parse(ls) : [];
		hist.push(f.filePaths[0]);
		localStorage.setItem(LS_KEY, JSON.stringify(hist));
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
