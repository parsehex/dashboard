import { createWindow } from './window';

const env = import.meta.env;

export async function openHelp(page = '') {
	if (page === '/') page = 'index.html';

	if (page && page[0] === '/') {
		console.warn('help page should be relative, got ' + page);
		page = page.slice(1);
	}
	if (!/\.html$/i.test(page)) page += '.html';

	await createWindow({ key: 'helpWindow', page: helpPageUrl(page) });
}

/** `page` should be relative */
function helpPageUrl(page = '') {
	if (env.MODE === 'development') {
		return env.VITE_DEV_SERVER_URL + 'help/' + page;
	}
	return new URL('../renderer/help/' + page, 'file://' + __dirname).toString();
}
