import xlsx from 'xlsx';

export default class TSheetsHoursReport {
	protected static NameRegex = /hours_report_.*\.xlsx?/;

	public static validate(data: Buffer | string) {
		if (typeof data === 'string') return this.validateName(data);
		return this.validateContent(data);
	}
	protected static validateContent(data: Buffer) {
		const wb = xlsx.read(data, { type: 'array' });
		const { SheetNames, Sheets } = wb;

		if (SheetNames.length > 1) return false;
		if (SheetNames[0] !== 'Worksheet') return false;

		const A1: xlsx.CellObject = Sheets[SheetNames[0]]['A1'];
		// check that A1 starts with the text "Summary report"
		if (A1.t !== 's') return false;
		if (A1.v?.toString().indexOf('Summary report') !== 0) return false;

		return true;
	}
	protected static validateName(n: string) {
		return this.NameRegex.test(n);
	}
}
