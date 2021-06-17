import process from '../process';

export { Presets } from './chart';
export { Columns } from './spreadsheet';

export const ReportName: ReportType = 'Revenue Per Session';

export const DefaultReport: RPSReport.Report = {
	'% Collected': [],
	'Appointment Type': [],
	'Billing Method': [],
	Clinician: [],
	Month: [],
	Patient: [],
	'Primary Insurer': [],
	'Secondary Insurer': [],
	'Service Type': [],
	'Write Offs': [],
};

export const Processor = process;

export const RequiredFiles: ReportDep[] = [
	{ type: 'TNBillingStatement', key: 'billing' },
];
