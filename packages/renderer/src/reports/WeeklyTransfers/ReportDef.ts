import { colDef } from '@/lib/utils';
import process from './process';

export const ReportName: ReportType = 'Weekly Transfers';

export const Columns: TabulatorSpreadsheetColumnDefs = {
	'Weekly Transfers': [
		colDef('Name'),
		colDef('Amount', { formatter: 'money' }),
	],
};

export const DefaultReport: WeeklyTransfers.Report = {
	'Weekly Transfers': [],
};

export const Presets = undefined;

export const Processor = process;

export const RequiredFiles: ReportDep[] = [
	{ type: 'PNCDepositActivity', key: 'deposits' },
	{ type: 'PayrollSummary', key: 'payroll' },
];

export const Options: ReportOptions = [
	{ type: 'date', key: 'startDate', label: 'Start Date' },
	{ type: 'date', key: 'endDate', label: 'End Date' },
];
