import xlsx from 'xlsx';
import { isAfter, isBefore, parse, sub } from 'date-fns';
import { newDateFromExcel } from '@/lib/utils';

export default async function (
	input: WeeklyTransfers.InputFilesArg,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	{ startDate, endDate }: WeeklyTransfers.InputOptions,
	reportName: string
): Promise<WeeklyTransfers.Report> {
	console.group('process weekly transfers');

	const start = parse(reportName, 'yy-MM-dd', new Date());
	const end = sub(start, { days: 7 });

	const files: WeeklyTransfers.InputFiles = {
		deposits: [],
		payroll: [],
	};

	const dWb = xlsx.read(input.deposits, { type: 'array' });
	files.deposits = xlsx.utils.sheet_to_json(dWb.Sheets[dWb.SheetNames[0]]);

	const pWb = xlsx.read(input.payroll, { type: 'array' });
	files.payroll = xlsx.utils.sheet_to_json(pWb.Sheets[pWb.SheetNames[0]], {
		header: [
			'Date',
			'Name',
			'Net Amt',
			'Hours',
			'Taxes Withheld',
			'Total Deductions',
			'Company Contributions',
			'Total Pay',
			'Employer Taxes',
			'Total Cost',
			'Check Num',
		],
	});

	const report: WeeklyTransfers.Report = {
		'Weekly Transfers': [],
	};
	let Payroll = 0;
	let Benefits = 0;
	const AutoMaintInsur = 600;

	let DepositsTotal = 0;

	for (const row of files.payroll) {
		if (!row.Date?.trim() || !row.Name || typeof row['Net Amt'] !== 'number')
			continue;
		Payroll += row['Taxes Withheld'] + row['Employer Taxes'];
		Benefits += row['Total Deductions'] + row['Company Contributions'];
	}

	for (const row of files.deposits) {
		if (!row.Deposits) continue;

		const rowDate = newDateFromExcel(row.Date);
		if (isBefore(rowDate, start) || isAfter(rowDate, end)) continue;

		if (/online\s+transfer/i.test(row.Description)) continue;

		DepositsTotal += row.Deposits;
	}

	report['Weekly Transfers'].push({
		Name: 'Payroll',
		Amount: Payroll,
	});
	report['Weekly Transfers'].push({
		Name: 'Benefits',
		Amount: Benefits + 800,
	});
	report['Weekly Transfers'].push({
		Name: 'Auto Maint Insur',
		Amount: AutoMaintInsur,
	});

	report['Weekly Transfers'].push({
		Name: 'Gross Revenue Deposits Total',
		Amount: DepositsTotal,
	});
	report['Weekly Transfers'].push({
		Name: 'Draw (2%)',
		Amount: DepositsTotal * 0.02,
	});
	report['Weekly Transfers'].push({
		Name: 'Inc Tax (5%)',
		Amount: DepositsTotal * 0.05,
	});
	report['Weekly Transfers'].push({
		Name: 'Bus Savings (2%)',
		Amount: DepositsTotal * 0.02,
	});
	report['Weekly Transfers'].push({
		Name: 'InSync pay-off (7.5%)',
		Amount: DepositsTotal * 0.075,
	});

	console.groupEnd();

	return report;
}
