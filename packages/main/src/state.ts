import { BrowserWindow } from 'electron';

interface State {
	mainWindow: BrowserWindow | null;
	windows: BrowserWindow[];
}

const state: State = {
	mainWindow: null,
	windows: [],
};

export default state;
