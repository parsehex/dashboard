import xlsx from 'xlsx';

export default class FileValidator {
	protected static Sheets: string[] = [];
	protected static Columns: { [sheetName: string]: string[] } = {};
	protected static NameRegex: RegExp;

	protected static checkSheetColumns(wb: xlsx.WorkBook) {
		const { Sheets, SheetNames } = wb;
		const SN = Object.keys(this.Columns);
		for (const col of SN) {
			const isRegex = col[0] === '/' && col[col.length - 1] === '/';
			const r = new RegExp(isRegex ? col.slice(1, col.length - 1) : /.*/);

			let resolvedSheet = '';
			for (const n of SheetNames) {
				if (!isRegex) {
					if (n === col) {
						resolvedSheet = n;
						break;
					}
					continue;
				}

				if (r.test(n)) {
					resolvedSheet = n;
				}
			}

			if (!resolvedSheet) return false;

			const data: GenericObject[] = xlsx.utils.sheet_to_json(
				Sheets[resolvedSheet]
			);

			const dataCols = Object.keys(data[0]);
			for (const C of this.Columns[col]) {
				if (!dataCols.includes(C)) return false;
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

		return this.checkSheetColumns(wb);
	}
	protected static validateName(fileName: string) {
		return this.NameRegex.test(fileName);
	}
}
