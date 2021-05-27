import { useElectron } from '../use-electron';

const { exists } = useElectron();

const LS_SUFFIX = 'file-history';

export function getLSKey(fileType: SupportedFileType) {
	return fileType + '_' + LS_SUFFIX;
}

export function addToHistory(fileType: SupportedFileType, p: string) {
	const hist = recentlyOpenedFiles(fileType);
	hist.unshift(p);
	localStorage.setItem(getLSKey(fileType), JSON.stringify(hist));
}
export function removeFromHistory(fileType: SupportedFileType, p: string) {
	const hist = recentlyOpenedFiles(fileType);
	const i = hist.indexOf(p);
	hist.splice(i, 1);
	localStorage.setItem(getLSKey(fileType), JSON.stringify(hist));
}

export function recentlyOpenedFiles(fileType: SupportedFileType): string[] {
	const ls = localStorage.getItem(getLSKey(fileType));
	return ls ? JSON.parse(ls) : [];
}
export async function recentlyOpenedFilesClean(fileType: SupportedFileType) {
	const hist = recentlyOpenedFiles(fileType);
	let cleaned = false;
	for (const p of hist) {
		if (!(await exists(p))) {
			hist.splice(hist.indexOf(p), 1);
			cleaned = true;
		}
	}
	if (cleaned) localStorage.setItem(getLSKey(fileType), JSON.stringify(hist));
	return hist;
}
