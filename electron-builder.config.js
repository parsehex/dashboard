require('dotenv').config();

// const now = new Date();
// const buildVersion = `${now.getFullYear() - 2000}.${
// 	now.getMonth() + 1
// }.${now.getDate()}`;

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
	appId: 'net.thomasmays.dashboard',
	productName: 'Dashboard',
	copyright: 'Copyright © 2021 Thomas Mays',
	directories: {
		output: 'dist',
		buildResources: 'buildResources',
	},
	win: {
		target: 'nsis',
	},
	files: ['packages/**/dist/**'],
	extraMetadata: {
		// version: buildVersion,
	},
	publish: {
		provider: 'github',
		private: true,
	},
};

module.exports = config;
