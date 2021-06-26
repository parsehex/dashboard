import { BrowserWindow, dialog, ipcMain } from 'electron';
import type { SaveDialogOptions } from 'electron';
import { readFile, writeFile } from 'fs-extra';
import { join, resolve } from 'path';
import XLSX from 'node-xlsx';
import XlsxTemplate from 'xlsx-template';
import { fetchFiles, setupDir } from './dir';
import { FileFilters } from './file-types';
import { openHelp } from './help';
import state from './state';
import { store } from './store';
import { cleanObj, cleanStr } from './utils';

export function send(channel: string, ...args: any[]) {
	state.mainWindow?.webContents.send(channel, ...args);
}

ipcMain.handle('get-version', async () => {
	const { autoUpdater } = await import('electron-updater');
	return autoUpdater.currentVersion.version;
});

interface SaveOptions {
	fileName: string;
	d: any;
	defaultDirectory?: string;
}

ipcMain.handle('get-all-files', async () => await fetchFiles());
ipcMain.handle(
	'save-as',
	async (event, { fileName, d, defaultDirectory }: SaveOptions) => {
		const ext = fileName.split('.').slice(-1).join();
		const fileFilter = FileFilters[ext];
		const opts: SaveDialogOptions = {
			filters: [fileFilter],
			defaultPath: fileName,
		};
		if (defaultDirectory) opts.defaultPath = join(defaultDirectory, fileName);

		const f = await dialog.showSaveDialog(
			state.mainWindow as BrowserWindow,
			opts
		);
		if (f.canceled || !f.filePath) return;
		const file = f.filePath;
		await writeFile(file, d);
	}
);

ipcMain.handle(
	'save-sheet',
	async (event, { fileName, d, defaultDirectory }: SaveOptions) => {
		const ext = fileName.split('.').slice(-1).join();
		const fileFilter = FileFilters[ext];
		const opts: SaveDialogOptions = {
			filters: [fileFilter],
			defaultPath: fileName,
		};
		if (defaultDirectory) opts.defaultPath = join(defaultDirectory, fileName);

		const f = await dialog.showSaveDialog(
			state.mainWindow as BrowserWindow,
			opts
		);
		if (f.canceled || !f.filePath) return;
		const file = f.filePath;

		const data = XLSX.build(d);
		await writeFile(file, data);
	}
);

interface SaveReportOptions {
	fileName: string;
	d: any;
	defaultDirectory?: string;
	reportType: ReportType;
}

// save report
ipcMain.handle(
	'save-report',
	async (
		event,
		{ fileName, d, defaultDirectory, reportType }: SaveReportOptions
	) => {
		const dat = JSON.parse(JSON.stringify(d));
		const reports = Object.keys(dat);
		for (const r of reports) {
			const sheet: Record<string, unknown>[] = dat[r];
			for (let i = 0; i < sheet.length; i++) {
				sheet[i] = cleanObj(sheet[i]);
			}
		}

		const tPath = resolve(
			__dirname,
			'../templates',
			reportType.replace(/\s/g, '') + '.xlsx'
		);
		console.log(tPath);
		const tData = await readFile(tPath);
		const template = new XlsxTemplate(tData);

		// template.substitute('Patient', { table: dat.Patient });

		const sheets = Object.keys(dat);
		for (const sheet of sheets) {
			// console.log(sheet, { table: dat[sheet] });
			template.substitute(sheet, { table: dat[sheet] });
		}

		const ext = fileName.split('.').slice(-1).join();
		const fileFilter = FileFilters[ext];
		const opts: SaveDialogOptions = {
			filters: [fileFilter],
			defaultPath: fileName,
		};
		if (defaultDirectory) opts.defaultPath = join(defaultDirectory, fileName);
		const f = await dialog.showSaveDialog(
			state.mainWindow as BrowserWindow,
			opts
		);
		if (f.canceled || !f.filePath) return;
		const file = f.filePath;

		await writeFile(file, template.generate({ type: 'uint8array' }));
	}
);

ipcMain.handle('get-dir', () => store.get('dir'));
ipcMain.handle('pick-dir', async () => {
	const f = await dialog.showOpenDialog(state.mainWindow as BrowserWindow, {
		properties: ['openDirectory'],
	});
	if (f.canceled || f.filePaths.length === 0) return;
	const d = f.filePaths[0];
	store.set('dir', d);
	await setupDir();
	send('dir', d);
});

ipcMain.handle('help', async (e, page?: string) => {
	await openHelp(page);
});
