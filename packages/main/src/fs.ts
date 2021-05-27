import { stat } from 'fs-extra';

export async function exists(p: string) {
	try {
		await stat(p);
		return true;
	} catch (e) {
		return false;
	}
}
