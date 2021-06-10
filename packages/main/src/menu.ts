import { Menu } from 'electron';
import { openHelp } from './help';
import { tryUpdate } from './update';

const menu = Menu.buildFromTemplate([
	{
		label: 'File',
		submenu: [{ role: 'quit' }],
	},
	{
		label: 'Help',
		submenu: [
			{
				label: 'Open Knowledge Base',
				accelerator: 'F1',
				click: () => openHelp(),
			},
			{ label: 'Check for update', click: () => tryUpdate() },
			// { label: 'About' },
			{
				label: 'Developer Tools',
				submenu: [{ role: 'reload' }, { role: 'toggleDevTools' }],
			},
		],
	},
]);
Menu.setApplicationMenu(menu);
