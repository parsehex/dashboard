import Store from 'electron-store';

export const store = new Store<AppStore>({
	defaults: {
		// NOTE mainWindow used to be called window
		mainWindow: {
			x: 0,
			y: 0,
			width: 800,
			height: 600,
			maximized: true,
		},
		helpWindow: {
			x: 0,
			y: 0,
			width: 800,
			height: 600,
			maximized: false,
		},
		dir: '',
	},
});
