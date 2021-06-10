import logger from 'electron-log';
import { autoUpdater } from 'electron-updater';

autoUpdater.logger = logger;
(autoUpdater.logger as any).transports.file.level = 'info';

export async function tryUpdate() {
	console.log(`Dashboard v${autoUpdater.currentVersion.version}`);
	try {
		await autoUpdater.checkForUpdatesAndNotify();
	} catch (e) {
		console.error('Failed update check:', e);
	}
}
