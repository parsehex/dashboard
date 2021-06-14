import { ipcMain } from 'electron';
import logger from 'electron-log';
import { autoUpdater } from 'electron-updater';
import { send } from './ipc';

autoUpdater.logger = logger;
(autoUpdater.logger as any).transports.file.level = 'info';

autoUpdater.addListener('update-downloaded', () => {
	send('update-avaliable');
});
ipcMain.handle('update', () => {
	autoUpdater.quitAndInstall();
});

export async function tryUpdate() {
	console.log(`Dashboard v${autoUpdater.currentVersion.version}`);
	try {
		await autoUpdater.checkForUpdatesAndNotify();
	} catch (e) {
		console.error('Failed update check:', e);
	}
}
