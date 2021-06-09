import xlsx from 'xlsx';

export default class FileValidator {
	protected static Sheets: string[] = [];
	protected static Columns: { [sheetName: string]: string[] } = {};
	protected static NameRegex: RegExp;

	protected static checkSheetNames(wb: xlsx.WorkBook) {
		const { SheetNames } = wb;
		for (const s of SheetNames) {
			let doesMatch = false;
			const isRegex = s[0] === '/' && s[s.length - 1] === '/';
			if (isRegex) {
				const r = new RegExp(s.replace(/\//g, ''));
				const results = SheetNames.map((sh) => r.test(sh));
				doesMatch = results.includes(true);
			} else {
				doesMatch = SheetNames.includes(s);
			}
			if (!doesMatch) return false;
		}
		return true;
	}
	protected static checkSheetColumns(wb: xlsx.WorkBook) {
		const { Sheets } = wb;
		const SN = Object.keys(this.Columns);
		for (const S of SN) {
			const data: GenericObject[] = xlsx.utils.sheet_to_json(Sheets[S]);
			const cols = Object.keys(data[0]);
			for (const C of this.Columns[S]) {
				if (!cols.includes(C)) return false;
			}
		}
		return true;
	}

	public static validate(data: Buffer | string) {
		if (typeof data === 'string') return this.validateName(data);
		return this.validateContent(data);
	}
	protected static validateContent(data: Buffer) {
		const wb = xlsx.read(data, { type: 'array' });

		return this.checkSheetNames(wb) || this.checkSheetColumns(wb);
	}
	protected static validateName(fileName: string) {
		return this.NameRegex.test(fileName);
	}
}
