interface ElectronApi {
	readonly versions: NodeJS.ProcessVersions;
	readonly dialog: typeof import('@electron/remote').dialog;
	readonly readFile: typeof import('fs-extra')['readFile'];
	readonly writeFile: typeof import('fs-extra')['writeFile'];
	readonly path: typeof import('path');
	readonly ipcRenderer: typeof import('electron')['ipcRenderer'];
	readonly bufferFrom: typeof Buffer.from;
}

declare interface Window {
	electron: Readonly<ElectronApi>;
	electronRequire?: NodeRequire;
}
