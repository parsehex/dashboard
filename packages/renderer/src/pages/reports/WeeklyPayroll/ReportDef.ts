import { colDef } from '@/lib/utils';
import process from './process';

export const ReportName: ReportType = 'Weekly Payroll';

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [
		colDef('Name'),
		colDef('Vaca Hrs'),
		colDef('Admin Hrs'),
		colDef('Admin Rate'),
		colDef('Admin Gross'),
		colDef('Clin Hrs'),
		colDef('Clin Rate'),
		colDef('Clin Gross'),
		colDef('IOP Rate'),
		colDef('IOP Reg Hrs'),
		colDef('Total Hrs'),
		colDef('Total Gross'),
	],
};

export const DefaultReport: WeeklyPayroll.Report = {
	Employees: [],
};

export const Presets: ChartPresets = {
	Employees: [
		{
			type: 'bar-stacked',
			title: 'Admin vs Clin Hours',
			mainColumn: 'Name',
			datasets: [
				{
					key: 'Admin Hrs',
					color: '#2196F3',
				},
				{
					key: 'Clin Hrs',
					color: '#FF9800',
				},
			],
		},
		{
			type: 'pie',
			title: 'Total Gross',
			mainColumn: 'Name',
			datasets: [
				{
					key: 'Total Gross',
					color: '--AUTO--',
				},
			],
		},
	],
};

export const Processor = process;

export const RequiredFiles: ReportDep[] = [
	{ type: 'TNBillingStatement', key: 'billing' },
	{ type: 'TSheetsHoursReport', key: 'hours' },
	{ type: 'PayrollOptions', key: 'options', common: true },
];
