import * as fs from 'fs-extra';
import { store } from './store';
import { join, resolve } from 'path';
import chokidar from 'chokidar';
import state from './state';
import { exists } from './fs';

const Reports = ['Weekly Payroll', 'Weekly Transfers', 'Revenue Per Session'];

export async function setupDir() {
	const dir = store.get('dir');
	if (!dir) {
		console.log('No directory set');
		return;
	}

	for (const k of Reports) {
		const p = resolve(dir, k);
		if (await exists(p)) continue;
		await fs.mkdirp(p);
	}

	chokidar.watch(dir).on('all', async () => {
		state.mainWindow?.webContents.send('files', await fetchFiles());
	});
}

export async function fetchFiles() {
	const dir = store.get('dir');
	const reports: FilesList = {
		'Weekly Payroll': { files: [] },
		'Weekly Transfers': { files: [] },
		'Revenue Per Session': { files: [] },
	};
	for (const reportType of Reports) {
		const reportTypeDir = join(dir, reportType);
		if (!(await exists(reportTypeDir))) await fs.mkdirp(reportTypeDir);
		const files = await fs.readdir(reportTypeDir);
		for (const f of files) {
			const p = join(reportTypeDir, f);
			const stat = await fs.stat(p);
			if (!stat.isDirectory()) {
				reports[reportType].files.push(f);
				continue;
			}
			const fFiles = await fs.readdir(p);
			reports[reportType][f] = fFiles;
		}
	}

	return reports;
}
