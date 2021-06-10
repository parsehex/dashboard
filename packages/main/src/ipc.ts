import state from './state';

export function send(channel: string, ...args: any[]) {
	state.mainWindow?.webContents.send(channel, ...args);
}
