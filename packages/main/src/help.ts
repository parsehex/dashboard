import { send } from './ipc';

export async function openHelp() {
	send('help');
}
