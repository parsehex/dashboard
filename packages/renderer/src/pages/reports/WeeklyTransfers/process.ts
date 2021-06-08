import xlsx from 'xlsx';

export default async function (
	input: WeeklyTransfers.InputFilesArg
): Promise<WeeklyTransfers.Report> {
	console.group('process weekly transfers');
	const files: WeeklyTransfers.InputFiles = {
		deposits: [],
		payroll: [],
	};

	const wb = xlsx.read(input, { type: 'array' });
	files.deposits = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

	const report: WeeklyTransfers.Report = {
		'Weekly Transfers': [],
	};

	// Rows:
	// Payroll
	// Benefits
	// Auto maint insur = 600

	// need at least 2 loops
	// loop over data - find all relevant transactions and save them
	// loop over report - calculate the % of Total column

	// for (const row of files.deposits) {
	console.log(files.deposits);
	// }

	console.groupEnd();

	return report;
}
