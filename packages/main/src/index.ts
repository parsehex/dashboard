import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import { store } from './store';
import { setupWindowEvents } from './window-events';
import state from './state';
import { writeFile } from 'fs-extra';
import { fetchFiles, setupDir } from './dir';
import { installExtensions } from './extensions';
import { send } from './ipc';
import './menu';
import XLSX from 'node-xlsx';
import { tryUpdate } from './update';
require('@electron/remote/main').initialize();

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

const env = import.meta.env;

export const FileFilters: { [ext: string]: Electron.FileFilter } = {
	png: { name: 'PNG files', extensions: ['png'] },
	xlsx: { name: 'XLSX files', extensions: ['xlsx'] },
	csv: { name: 'CSV files', extensions: ['csv'] },
};

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
	const win = new BrowserWindow({
		show: true,
	});
	if (!page) page = 'index.html';
	await win.loadURL(pageUrl(join('help', page)));
});

const createWindow = async () => {
	const winSettings = store.get('window');

	state.mainWindow = new BrowserWindow({
		show: true,
		width: winSettings.width,
		height: winSettings.height,
		x: winSettings.x,
		y: winSettings.y,
		webPreferences: {
			preload: join(__dirname, '../../preload/dist/index.cjs'),
			contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
			enableRemoteModule: true, // Spectron tests can't work with enableRemoteModule: false
		},
	});
	if (winSettings.maximized) state.mainWindow.maximize();

	if (env.MODE === 'development') {
		state.mainWindow.webContents.once('dom-ready', () =>
			state.mainWindow?.webContents.openDevTools()
		);
	}

	setupWindowEvents(state.mainWindow);

	await state.mainWindow.loadURL(pageUrl());
};

/**
 * URL for main window.
 * Vite dev server for development.
 * `file://../renderer/index.html` for production and test
 */
function pageUrl(p = 'dist/index.html') {
	if (env.MODE === 'development') return env.VITE_DEV_SERVER_URL;
	return new URL('../renderer/' + p, 'file://' + __dirname).toString();
}

app.on('second-instance', () => {
	console.log('second-instance');
	if (state.mainWindow) {
		if (state.mainWindow.isMinimized()) state.mainWindow.restore();
		state.mainWindow.focus();
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('browser-window-created', (e, win) => {
	// this should keep all open windows from being GCed
	state.windows.push(win);
	win.on('close', () => {
		const i = state.windows.indexOf(win);
		state.windows.splice(i, 1);
		win.destroy();
	});
});

app.on('ready', async () => {
	if (env.MODE === 'development') await installExtensions();

	try {
		await createWindow();
	} catch (e) {
		console.error('Failed to create window:', e);
	}

	if (env.PROD) await tryUpdate();
});

(async () => {
	await setupDir();
})();
