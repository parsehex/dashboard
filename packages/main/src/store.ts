import Store from 'electron-store';

export const store = new Store<AppStore>({
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
