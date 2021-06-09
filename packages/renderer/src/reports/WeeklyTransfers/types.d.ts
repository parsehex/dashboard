declare namespace WeeklyTransfers {
	interface ReportRow {
		Name: string;
		Amount: number;
	}
	type Report = { 'Weekly Transfers': ReportRow[] };

	interface PNCDepositActivity {
		Date: number;
		Description: string;
		Withdrawals: number;
		Deposits: number;
		Balance: number;
	}
	interface PayrollSummary {
		Date: string;
		Name: string;
		'Net Amt': number;
		Hours: string;
		'Taxes Withheld': number;
		'Total Deductions': number;
		'Company Contributions': number;
		'Total Pay': number;
		'Employer Taxes': number;
		'Total Cost': number;
		'Check Num': string;
	}

	interface InputFilesArg {
		deposits: Buffer;
		payroll: Buffer;
	}
	interface InputFiles {
		deposits: PNCDepositActivity[];
		payroll: PayrollSummary[];
	}
	interface InputOptions {
		startDate: string;
		endDate: string;
	}
}
