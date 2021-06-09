const { remove } = require('fs-extra');
const path = require('path');
const pkg = require('../package.json');

(async () => {
	const BaseDir = path.join(process.env.APPDATA, pkg.name);
	await remove(BaseDir);
})();
