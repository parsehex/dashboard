const { remove, readJSON, writeJSON } = require('fs-extra');
const path = require('path');
const pkg = require('../package.json');

const id = 'ljjemllljcmogpfapbkkighbhhppjdbg';
(async () => {
	const BaseDir = path.join(process.env.APPDATA, pkg.name, 'extensions', id);
	const ManifestPath = path.join(BaseDir, 'manifest.json');

	await remove(path.join(BaseDir, '_metadata'));

	const manifest = await readJSON(ManifestPath);

	delete manifest.browser_action;
	delete manifest.update_url;
	manifest.permissions.splice(manifest.permissions.indexOf('contextMenus'), 1);
	await writeJSON(ManifestPath, manifest);
})();
