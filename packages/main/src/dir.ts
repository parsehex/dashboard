import * as fs from 'fs-extra';
import FileTypes, { getKeyFromFile } from './file-types';
import { store } from './store';
import { join } from 'path';
import chokidar from 'chokidar';
import state from './state';

export async function setupDir() {
	const dir = store.get('dir');
	if (!dir) return;

	for (const f of FileTypes.keys) {
		if (!(await exists(join(dir, f)))) {
			await fs.mkdir(join(dir, f));
		}
	}

	chokidar.watch(dir).on('all', async () => {
		state.mainWindow?.webContents.send('files', await fetchFiles());
	});
}

async function exists(p: string) {
	try {
		await fs.stat(p);
		return true;
	} catch (e) {
		return false;
	}
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
