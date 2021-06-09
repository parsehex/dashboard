declare namespace WeeklyPayroll {
	interface EmployeeRow {
		Name: string;
		'Vaca Hrs': number;
		'Admin Hrs': number;
		'Admin Rate': number;
		'Admin Gross': number;
		'Clin Hrs': number;
		'Clin Rate': number;
		'Clin Gross': number;
		'IOP Rate': number;
		'IOP Reg Hrs': number;
		'Total Hrs': number;
		'Total Gross': number;
	}
	type Report = { Employees: EmployeeRow[] };

	interface InputFilesArg {
		options: Buffer;
		hours: Buffer;
		billing: Buffer;
	}

	interface InputFiles {
		billing: TherapyNotesRow[];
		hours: TSheets.HoursReport[];
		limits: PayrollOptions.HoursLimits[];
		medicare: PayrollOptions.BillingCounselorOverride[];
		salaried: PayrollOptions.SalariedEmployees[];
		rates: PayrollOptions.Rates[];
		aliases: PayrollOptions.Aliases[];
	}
}
