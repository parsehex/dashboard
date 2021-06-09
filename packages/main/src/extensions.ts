// import { app } from 'electron';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

export async function installExtensions() {
	// const { default: installExtension, VUEJS3_DEVTOOLS } = await import(
	// 	'electron-devtools-installer'
	// );
	try {
		const extName = await installExtension(VUEJS3_DEVTOOLS.id, {
			loadExtensionOptions: {
				allowFileAccess: true,
			},
		});
		console.log(`Installed extension: ${extName}`);
	} catch (e) {
		console.log('Failed installing extension:', e);
	}
}
