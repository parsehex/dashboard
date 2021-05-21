import { BrowserWindow } from 'electron';

interface State {
	mainWindow: BrowserWindow | null;
}

const state: State = {
	mainWindow: null,
};

export default state;
