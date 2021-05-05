import numeral from 'numeral';

export function generateID() {
	return '' + Math.random().toString(36).substr(2, 9);
}

export function clone<T>(d: T): T {
	return JSON.parse(JSON.stringify(d));
}

export function idFromString(str: TableDataType) {
	if (typeof str !== 'string') str = str.toString();
	return str.toLowerCase().replace(/['"]/g, '').replace(/[ ]/g, '-');
}

export function newDateFromExcel(serial: number) {
	// it would be wise to never touch this function again
	const utc_days = Math.floor(serial - 25568);
	const utc_value = utc_days * 86400;
	const date_info = new Date(utc_value * 1000);

	const fractional_day = serial - Math.floor(serial) + 0.0000001;

	let total_seconds = Math.floor(86400 * fractional_day);

	const seconds = total_seconds % 60;

	total_seconds -= seconds;

	const hours = Math.floor(total_seconds / (60 * 60));
	const minutes = Math.floor(total_seconds / 60) % 60;

	return new Date(
		date_info.getFullYear(),
		date_info.getMonth(),
		date_info.getDate(),
		hours,
		minutes,
		seconds
	);
}

export function now() {
	return new Date();
}

export function nowSeconds() {
	return Math.round(Date.now() / 1000);
}

/** Format number as a dollar string (with dolar sign) */
export function $(money: number) {
	return '$' + numeral(money).format('0,0.00');
}

export function lastIndexOf<T extends { [k: string]: any }>(
	arr: T[],
	prop: keyof T,
	val: any
) {
	for (let i = arr.length - 1; i >= 0; i--) {
		if (arr[i][prop] === val) return i;
	}
	return -1;
}

export function uniqObjectArray<T extends GenericObject>(
	arr: T[],
	uniqKey: keyof T
): T[] {
	const uniqArr = [];

	const seenIds: string[] = [];
	for (let i = arr.length - 1; i >= 0; i--) {
		const row = arr[i];
		const id = row[uniqKey];
		if (seenIds.includes(id)) {
			continue;
		} else {
			seenIds.push(id);
			uniqArr.push(row);
		}
	}

	return uniqArr;
}

export function genNAColumns(columnNames: string | string[]) {
	const tableData: TableRowObject = {};

	if (typeof columnNames === 'string') columnNames = [columnNames];
	for (const n of columnNames) {
		tableData[n] = {
			text: 'N/A',
			value: -1,
		};
	}

	return tableData;
}

export function inObj<O extends GenericObject>(obj: O, key: string) {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

export function pad(n: string | number, w: number, fillString = '0') {
	return n.toString().padStart(w, fillString);
}
