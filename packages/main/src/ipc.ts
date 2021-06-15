import { BrowserWindow, dialog, ipcMain } from 'electron';
import { writeFile } from 'fs-extra';
import XLSX from 'node-xlsx';
import { fetchFiles, setupDir } from './dir';
import { FileFilters } from './file-types';
import { openHelp } from './help';
import state from './state';
import { store } from './store';

export function send(channel: string, ...args: any[]) {
	state.mainWindow?.webContents.send(channel, ...args);
}

ipcMain.handle('get-version', async () => {
	const { autoUpdater } = await import('electron-updater');
	return autoUpdater.currentVersion.version;
});

ipcMain.handle('get-all-files', async () => await fetchFiles());
ipcMain.handle('save-as', async (event, { fileName, d }: any) => {
	const ext = fileName.split('.').slice(-1).join();
	const fileFilter = FileFilters[ext];
	const f = await dialog.showSaveDialog(state.mainWindow as BrowserWindow, {
		filters: [fileFilter],
		defaultPath: fileName,
	});
	if (f.canceled || !f.filePath) return;
	const file = f.filePath;
	await writeFile(file, d);
});
ipcMain.handle('save-sheet', async (event, { fileName, d }: any) => {
	const ext = fileName.split('.').slice(-1).join();
	const fileFilter = FileFilters[ext];
	const f = await dialog.showSaveDialog(state.mainWindow as BrowserWindow, {
		filters: [fileFilter],
		defaultPath: fileName,
	});
	if (f.canceled || !f.filePath) return;
	const file = f.filePath;

	const data = XLSX.build(d);
	await writeFile(file, data);
});

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
