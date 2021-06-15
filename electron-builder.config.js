require('dotenv').config();

const pkg = require('./package.json');

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
		publisherName: 'Thomas Mays',
		asar: false,
		verifyUpdateCodeSignature: false,
		signAndEditExecutable: false,
	},
	files: ['packages/**/dist/**', 'packages/renderer/help/**'],
	extraMetadata: {
		version: pkg.version,
	},
	publish: {
		provider: 'github',
		private: true,
		token: process.env.GH_TOKEN,
	},
};

module.exports = config;
