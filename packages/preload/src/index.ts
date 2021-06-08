import { contextBridge, ipcRenderer } from 'electron';
import remote from '@electron/remote';
import * as fs from 'fs-extra';
import * as path from 'path';
import { exists } from '../../main/src/fs';
import { store } from '../../main/src/store';

const { dialog, shell } = remote;

const apiKey = 'electron';
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api: ElectronApi = {
	versions: process.versions,
	dialog,
	readFile: fs.readFile.bind(fs),
	writeFile: fs.writeFile.bind(fs),
	path,
	ipcRenderer,
	on: ipcRenderer.on.bind(ipcRenderer),
	addListener: ipcRenderer.addListener.bind(ipcRenderer),
	bufferFrom: Buffer.from.bind(Buffer),
	exists,
	resolveFile: ({ report, file, reportName }) => {
		const dir = store.get('dir');
		const parts = [dir, report];
		if (reportName) parts.push(reportName);
		if (file) parts.push(file);
		return path.resolve(...parts);
	},
	mkdirp: fs.mkdirp.bind(fs),
	openFolder: async (folderPath) => {
		shell.openPath(folderPath);
	},
};

if (import.meta.env.MODE !== 'test') {
	/**
	 * The "Main World" is the JavaScript context that your main renderer code runs in.
	 * By default, the page you load in your renderer executes code in this world.
	 *
	 * @see https://www.electronjs.org/docs/api/context-bridge
	 */
	contextBridge.exposeInMainWorld(apiKey, api);
} else {
	/**
	 * Recursively Object.freeze() on objects and functions
	 * @see https://github.com/substack/deep-freeze
	 * @param obj Object on which to lock the attributes
	 */
	const deepFreeze = (obj: any) => {
		// eslint-disable-line @typescript-eslint/no-explicit-any
		if (typeof obj === 'object' && obj !== null) {
			Object.keys(obj).forEach((prop) => {
				const val = obj[prop];
				if (
					(typeof val === 'object' || typeof val === 'function') &&
					!Object.isFrozen(val)
				) {
					deepFreeze(val);
				}
			});
		}

		return Object.freeze(obj);
	};

	deepFreeze(api);

	window[apiKey] = api;

	// Need for Spectron tests
	window.electronRequire = require;
}
