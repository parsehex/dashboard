export function cleanStr(s: string) {
	return s.replace(/[%-\s]/g, '');
}
export function cleanObj(o: any): {
	[k: string]: any;
} {
	if (Array.isArray(o)) {
		const first = o[0];
		if (typeof first === 'object' && first !== null)
			return o.map((v) => cleanObj(v));
	}

	const O = JSON.parse(JSON.stringify(o));
	const cleanEntries: any[] = Object.entries(O).map((v) => [
		cleanStr(v[0]),
		v[1],
	]);
	return Object.fromEntries(cleanEntries);
}
