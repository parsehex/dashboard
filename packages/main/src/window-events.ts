import type { BrowserWindow } from 'electron';
import { store } from './store';

export function setupWindowEvents(win: BrowserWindow) {
	if (!win) return;

	let resizeWaiting = false;
	win.on('resize', () => {
		if (resizeWaiting) return;
		setTimeout(async () => {
			const newBounds = win?.getBounds();
			store.set('window', {
				...newBounds,
				maximized: store.get('window.maximized', false),
			});
			resizeWaiting = false;
		}, 750);
	});

	win.on('maximize', () => {
		const maximized = win?.isMaximized();
		store.set('window.maximized', maximized);
	});
}
