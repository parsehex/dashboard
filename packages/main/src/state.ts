import { BrowserWindow } from 'electron';

interface State {
	mainWindow: BrowserWindow | null;
	helpWindow: BrowserWindow | null;
	windows: BrowserWindow[];
}

const state: State = {
	mainWindow: null,
	helpWindow: null,
	windows: [],
};

export default state;
