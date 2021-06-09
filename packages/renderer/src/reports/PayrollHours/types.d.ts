declare namespace PayrollHours {
	interface EmployeeRow {
		Name: string;
		Admin: number;
		'Admin %': string;
		Clin: number;
		'Clin %': string;
		'Total Hrs': number;
		Gross: number;
	}
	interface TotalsRow {
		Period: string;
		Admin: number;
		Clin: number;
		Gross: number;
	}
	export type Report = { Employees: EmployeeRow[]; Totals: TotalsRow[] };

	interface InputFilesArg {
		hours: Buffer;
	}
}
