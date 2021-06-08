import { clone } from './utils';

export function log(...args: any[]) {
	args = args.map(clone);
	console.log(args);
}
