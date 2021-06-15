import { app } from 'electron';
import state from './state';
import { store } from './store';

export function setupMainWindowEvents() {
	const { mainWindow } = state;
	if (!mainWindow) return;

	mainWindow.on('close', () => {
		state.mainWindow = null;
		app.quit();
	});

	let resizeWaiting = false;
	mainWindow.on('resize', () => {
		if (resizeWaiting) return;
		setTimeout(async () => {
			const newBounds = mainWindow?.getBounds();
			store.set('mainWindow', {
				...newBounds,
				maximized: store.get('mainWindow.maximized', false),
			});
			resizeWaiting = false;
		}, 750);
	});

	mainWindow.on('maximize', () => {
		const maximized = mainWindow?.isMaximized();
		store.set('mainWindow.maximized', maximized);
	});
}
export function setupHelpWindowEvents() {
	const { helpWindow } = state;
	if (!helpWindow) return;

	helpWindow.on('close', () => {
		state.helpWindow = null;
	});

	let resizeWaiting = false;
	helpWindow.on('resize', () => {
		if (resizeWaiting) return;
		setTimeout(async () => {
			const newBounds = helpWindow?.getBounds();
			store.set('helpWindow', {
				...newBounds,
				maximized: store.get('helpWindow.maximized', false),
			});
			resizeWaiting = false;
		}, 750);
	});

	helpWindow.on('maximize', () => {
		const maximized = helpWindow?.isMaximized();
		store.set('helpWindow.maximized', maximized);
	});
}
