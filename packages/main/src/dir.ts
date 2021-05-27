import * as fs from 'fs-extra';
import FileTypes, { getKeyFromFile } from './file-types';
import { store } from './store';
import { join } from 'path';
import chokidar from 'chokidar';
import state from './state';
import glob from 'glob';

export async function setupDir() {
	const dir = store.get('dir');
	if (!dir) return;

	for (const k of FileTypes.keys) {
		if (await exists(k)) continue;
		const f = FileTypes.dictionary[k].name.file;
		await fs.mkdir(join(dir, f));
	}

	chokidar.watch(dir).on('all', async () => {
		state.mainWindow?.webContents.send('files', await fetchFiles());
	});
}

function exists(fileType: SupportedFileType) {
	return new Promise((resolve) => {
		const dir = store.get('dir');
		const p = join(dir, fileType + '*');
		glob(p, (err, matches) => {
			if (err) return resolve(false);
			if (matches.length > 0) return true;
		});
	});
}

export async function fetchFiles() {
	const dir = store.get('dir');
	const files = {} as FilesList;
	const f = await fs.readdir(dir);
	for (const file of f) {
		const thisFile = join(dir, file);
		const stat = await fs.stat(thisFile);
		if (stat.isDirectory()) {
			const key = getKeyFromFile(file);
			if (!key) continue;
			files[key] = (await fs.readdir(thisFile)).map((p) => join(thisFile, p));
		} else {
			const key = getKeyFromFile(file.split('.')[0]);
			if (!key) continue;
			files[key] = thisFile;
		}
	}
	return files;
}
