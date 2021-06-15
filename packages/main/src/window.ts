import { BrowserWindow } from 'electron';
import state from './state';
import { store } from './store';
import { setupHelpWindowEvents, setupMainWindowEvents } from './window-events';
import { join } from 'path';

const env = import.meta.env;

interface CreateWindowOptions {
	key: 'mainWindow' | 'helpWindow';
	page: string;
}

export async function createWindow({ key, page }: CreateWindowOptions) {
	if (key === 'helpWindow' && state[key] !== null) {
		await state[key]?.loadURL(page);
		return;
	}

	const winSettings = store.get(key);

	state[key] = new BrowserWindow({
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
	if (winSettings.maximized) state[key]?.maximize();

	if (env.MODE === 'development') {
		state[key]?.webContents.once('dom-ready', () =>
			state[key]?.webContents.openDevTools()
		);
	}

	if (key === 'helpWindow') setupHelpWindowEvents();
	else if (key === 'mainWindow') setupMainWindowEvents();

	await state[key]?.loadURL(page);
}
