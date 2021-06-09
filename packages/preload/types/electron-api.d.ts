interface ElectronApi {
	readonly versions: NodeJS.ProcessVersions;
	readonly dialog: typeof import('@electron/remote').dialog;
	readonly readFile: typeof import('fs-extra')['readFile'];
	readonly writeFile: typeof import('fs-extra')['writeFile'];
	readonly mkdirp: typeof import('fs-extra')['mkdirp'];
	readonly move: typeof import('fs-extra')['move'];
	readonly copy: typeof import('fs-extra')['copy'];
	readonly path: typeof import('path');
	readonly ipcRenderer: typeof import('electron')['ipcRenderer'];
	readonly on: typeof import('electron')['ipcRenderer']['on'];
	readonly addListener: typeof import('electron')['ipcRenderer']['addListener'];
	readonly bufferFrom: typeof Buffer.from;
	readonly exists: typeof import('../../main/src/fs')['exists'];
	readonly resolveFile: (opts: {
		report: string;
		file?: string;
		reportName?: string;
	}) => string;
	readonly openFolder: (folderPath: string) => Promise<void>;
	readonly getDir: () => string;
	readonly pickDir: () => Promise<void>;
}

declare interface Window {
	electron: Readonly<ElectronApi>;
	electronRequire?: NodeRequire;
}
