import { app } from 'electron';
import { URL } from 'url';
import { setupDir } from './dir';
import { installExtensions } from './extensions';
import './menu';
import state from './state';
import { tryUpdate } from './update';
import { createWindow } from './window';

const env = import.meta.env;
require('@electron/remote/main').initialize();

const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
	app.quit();
	process.exit(0);
}

app.on('second-instance', async () => {
	console.log('second-instance');
	if (state.mainWindow) {
		if (state.mainWindow.isMinimized()) state.mainWindow.restore();
		state.mainWindow.focus();
	}

	// this shouldn't happen right?
	try {
		await createWindow({ key: 'mainWindow', page: pageUrl() });
	} catch (e) {
		console.error('Failed to create window:', e);
	}
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', async () => {
	if (env.MODE === 'development') await installExtensions();

	try {
		await createWindow({ key: 'mainWindow', page: pageUrl() });
	} catch (e) {
		console.error('Failed to create window:', e);
	}
});

(async () => {
	await setupDir();
	if (env.PROD) await tryUpdate();
})();

/**
 * URL for main window.
 * Vite dev server for development.
 * `file://../renderer/dist/index.html` for production and test
 */
function pageUrl() {
	if (env.MODE === 'development') return env.VITE_DEV_SERVER_URL;
	return new URL(
		'../renderer/dist/index.html',
		'file://' + __dirname
	).toString();
}
