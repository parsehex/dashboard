import * as xlsx from 'xlsx';
import { useElectron } from './use-electron';

const LS_KEY = 'file-history';

export function recentlyOpenedFiles(): string[] {
	const ls = localStorage.getItem(LS_KEY);
	return ls ? JSON.parse(ls) : [];
}

export async function pickFile(remember?: boolean) {
	const { dialog } = useElectron();
	const f = await dialog.showOpenDialog({
		properties: ['openFile'],
	});
	if (!f.filePaths.length) return false;

	if (remember) {
		const ls = localStorage.getItem(LS_KEY);
		const hist: string[] = ls ? JSON.parse(ls) : [];
		hist.push(f.filePaths[0]);
		localStorage.setItem(LS_KEY, JSON.stringify(hist));
	}
	return f.filePaths[0];
}
export async function saveFile(d: Buffer) {
	const { dialog, writeFile } = useElectron();
	const f = await dialog.showSaveDialog({
		filters: [{ name: 'Excel files', extensions: ['xlsx'] }],
		defaultPath: 'Payroll Hours Breakdown.xlsx',
	});
	if (f.canceled || !f.filePath) return false;

	const file = f.filePath;
	await writeFile(file, d);
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
