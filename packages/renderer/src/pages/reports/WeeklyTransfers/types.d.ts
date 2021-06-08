declare namespace WeeklyTransfers {
	interface ReportRow {
		Name: string;
		Amount: number;
		'% of Total': number;
	}
	type Report = { 'Weekly Transfers': ReportRow[] };

	interface InputFilesArg {
		deposits: Buffer;
		payroll: Buffer;
	}
	interface InputFiles {
		deposits: PNCDepositActivity;
		payroll: PayrollSummary;
	}
}
