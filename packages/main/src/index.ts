import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
// import Chalk from 'chalk';
import logger from 'electron-log';
import { store } from './store';
import { setupWindowEvents } from './window-events';
// import * as fs from 'fs-extra';
import { fetchFiles, setupDir } from './dir';
import state from './state';
import { writeFile } from 'fs-extra';
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
};
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
ipcMain.handle('set-dir', async (event, d: string) => {
	store.set('dir', d);
	await setupDir();
	ipcMain.emit('dir', d);
});
ipcMain.handle(
	'pick-dir',
	async (event, options: Electron.OpenDialogOptions) => {
		return await dialog.showOpenDialog(
			state.mainWindow as BrowserWindow,
			options
		);
	}
);

ipcMain.handle('get-files', async () => {
	return await fetchFiles();
});
ipcMain.handle('get-dir', async () => {
	return store.get('dir');
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

	/**
	 * URL for main window.
	 * Vite dev server for development.
	 * `file://../renderer/index.html` for production and test
	 */
	const pageUrl =
		env.MODE === 'development'
			? env.VITE_DEV_SERVER_URL
			: new URL(
					'../renderer/dist/index.html',
					'file://' + __dirname
			  ).toString();

	if (env.MODE === 'development') {
		state.mainWindow.webContents.once('dom-ready', () =>
			state.mainWindow?.webContents.openDevTools()
		);
	}

	setupWindowEvents(state.mainWindow);

	await state.mainWindow.loadURL(pageUrl as string);
};

app.on('second-instance', () => {
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

app.on('ready', async () => {
	if (env.MODE !== 'production') {
		require('vue-devtools').install();
	}
	// if (env.MODE === 'development') await installExtensions();

	try {
		await createWindow();
	} catch (e) {
		console.error('Failed to create window:', e);
	}

	if (env.PROD) await tryUpdate();

	if (store.get('dir')) await setupDir();
});

async function tryUpdate() {
	const { autoUpdater } = await import('electron-updater');
	autoUpdater.logger = logger;

	console.log(`Dashboard v${autoUpdater.currentVersion.version}`);
	try {
		await autoUpdater.checkForUpdatesAndNotify();
	} catch (e) {
		console.error('Failed update check:', e);
	}
}
