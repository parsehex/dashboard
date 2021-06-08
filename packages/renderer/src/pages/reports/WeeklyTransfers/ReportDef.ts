import { colDef } from '@/lib/utils';
import process from './process';

export const ReportName: ReportType = 'Weekly Transfers';

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [colDef('Name'), colDef('Amount'), colDef('% of Total')],
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
