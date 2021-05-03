import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { URL } from 'url';
// import Chalk from 'chalk';
import logger from 'electron-log';

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

const env = import.meta.env;

// Install "Vue.js devtools"
if (env.MODE === 'development') {
	app
		.whenReady()
		.then(() => import('electron-devtools-installer'))
		.then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
			installExtension(VUEJS3_DEVTOOLS, {
				loadExtensionOptions: {
					allowFileAccess: true,
				},
			}),
		)
		.catch((e) => console.error('Failed install extension:', e));
}

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
	mainWindow = new BrowserWindow({
		show: true,
		webPreferences: {
			preload: join(__dirname, '../../preload/dist/index.cjs'),
			contextIsolation: env.MODE !== 'test', // Spectron tests can't work with contextIsolation: true
			enableRemoteModule: env.MODE === 'test', // Spectron tests can't work with enableRemoteModule: false
		},
	});

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
					'file://' + __dirname,
			  ).toString();

	if (env.MODE === 'development') {
		mainWindow.webContents.once('dom-ready', () =>
			mainWindow?.webContents.openDevTools(),
		);
	}

	await mainWindow.loadURL(pageUrl as string);
};

app.on('second-instance', () => {
	// Someone tried to run a second instance, we should focus our window.
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

app
	.whenReady()
	.then(createWindow)
	.catch((e) => console.error('Failed create window:', e));

(async () => {
	if (!env.PROD) return;
	await app.whenReady();

	const { autoUpdater } = await import('electron-updater');
	autoUpdater.logger = logger;

	console.log(`Dashboard v${autoUpdater.currentVersion.version}`);
	try {
		await autoUpdater.checkForUpdatesAndNotify();
	} catch (e) {
		console.error('Failed update check:', e);
	}
})();
