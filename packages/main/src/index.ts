import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { join } from 'path';
import { URL } from 'url';
import Store from 'electron-store';
// import Chalk from 'chalk';
import logger from 'electron-log';
require('@electron/remote/main').initialize();

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
			})
		)
		.catch((e) => console.error('Failed install extension:', e));
}

interface AppStore {
	window: {
		width: number;
		height: number;
		x: number;
		y: number;
		maximized: boolean;
	};
}

const store = new Store<AppStore>({
	defaults: {
		window: {
			x: 0,
			y: 0,
			width: 800,
			height: 600,
			maximized: false,
		},
	},
});
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

	setupWindowEvents();

	await mainWindow.loadURL(pageUrl as string);
};

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

(async () => {
	await app.whenReady();

	try {
		await createWindow();
	} catch (e) {
		console.error('Failed to create window:', e);
	}

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

function setupWindowEvents() {
	if (!mainWindow) return;

	let resizeWaiting = false;
	mainWindow.on('resize', () => {
		if (resizeWaiting) return;
		setTimeout(async () => {
			const newBounds = mainWindow?.getBounds();
			store.set('window', {
				...newBounds,
				maximized: store.get('window.maximized', false),
			});
			resizeWaiting = false;
		}, 750);
	});

	mainWindow.on('maximize', () => {
		const maximized = mainWindow?.isMaximized();
		store.set('window.maximized', maximized);
	});
}
