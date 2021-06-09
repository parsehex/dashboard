import { colDef } from '@/lib/utils';
import process from './process';

export const ReportName: ReportType = 'Payroll Hours Breakdown';

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [
		colDef('Name'),
		colDef('Admin'),
		colDef('Admin %', {
			sorter: 'number',
		}),
		colDef('Clin'),
		colDef('Clin %', {
			sorter: 'number',
		}),
		colDef('Total Hrs'),
		colDef('Gross', {
			formatter: 'money',
		}),
	],
	Totals: [
		colDef('Period'),
		colDef('Admin'),
		colDef('Clin'),
		colDef('Gross', {
			formatter: 'money',
		}),
	],
};

export const DefaultReport: PayrollHours.Report = {
	Employees: [],
	Totals: [],
};

const MainPreset = (mainColumn: string): ChartComponentConfigPreset => ({
	type: 'bar-stacked',
	title: 'Payroll hours by Admin vs Clin',
	mainColumn,
	datasets: [
		{
			key: 'Admin',
			color: '#2196F3',
		},
		{
			key: 'Clin',
			color: '#FF9800',
		},
	],
});
export const Presets: ChartPresets = {
	Employees: [MainPreset('Name')],
	Totals: [MainPreset('Period')],
};

export const Processor = process;

export const RequiredFiles: ReportDep[] = [
	{ type: 'TSheetsHoursReport', key: 'hours' },
];
