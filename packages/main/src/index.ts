import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
// import Chalk from 'chalk';
import logger from 'electron-log';
import { store } from './store';
import { setupWindowEvents } from './window-events';
require('@electron/remote/main').initialize();

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

const env = import.meta.env;

let mainWindow: BrowserWindow | null = null;

ipcMain.handle(
	'save-as',
	async (event, options: Electron.SaveDialogOptions) => {
		return await dialog.showSaveDialog(mainWindow as BrowserWindow, options);
	}
);

const createWindow = async () => {
	const winSettings = store.get('window');

	mainWindow = new BrowserWindow({
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
	if (winSettings.maximized) mainWindow.maximize();

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
		mainWindow.webContents.once('dom-ready', () =>
			mainWindow?.webContents.openDevTools()
		);
	}

	setupWindowEvents(mainWindow);

	await mainWindow.loadURL(pageUrl as string);
};

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore();
		mainWindow.focus();
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
