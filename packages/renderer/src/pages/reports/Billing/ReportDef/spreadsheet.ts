import { colDef } from '@/lib/utils';
import { getPrimaryColumnName } from '../data/table/primary-column';

function OwesColumnsDef() {
	return [
		colDef('Patient Owes', { formatter: 'money' }),
		colDef('Insurance Owes', { formatter: 'money' }),
		colDef('Total Owes', { formatter: 'money' }),
	];
}
function PaidColumnsDef() {
	return [
		colDef('Patient Paid', { formatter: 'money' }),
		colDef('Insurance Paid', { formatter: 'money' }),
		colDef('Paid Total', { formatter: 'money' }),
	];
}
function RPSColumnsDef() {
	return [
		colDef('Total Revenue', { formatter: 'money' }),
		colDef('Total Sessions'),
	];
}
function StatsColumnsDef() {
	return [
		colDef('Average', { formatter: 'money' }),
		colDef('Q1', { formatter: 'money' }),
		colDef('Median', { formatter: 'money' }),
		colDef('Q3', { formatter: 'money' }),
		colDef('IQR', { formatter: 'money' }),
	];
}

export const Columns: TabulatorSpreadsheetColumnDefs = {
	'% Collected': [
		colDef(getPrimaryColumnName('% Collected')),
		colDef('Total Expected', { formatter: 'money' }),
		colDef('% Collected', { sorter: 'number' }),
		...PaidColumnsDef(),
	],
	'Appointment Type': [
		colDef(getPrimaryColumnName('Appointment Type')),
		...StatsColumnsDef(),
	],
	'Billing Method': [
		colDef(getPrimaryColumnName('Billing Method')),
		...StatsColumnsDef(),
	],
	Clinician: [
		colDef(getPrimaryColumnName('Clinician')),
		...StatsColumnsDef(),
		...RPSColumnsDef(),
	],
	Month: [
		colDef(getPrimaryColumnName('Month')),
		...StatsColumnsDef(),
		...RPSColumnsDef(),
	],
	Patient: [
		colDef(getPrimaryColumnName('Patient')),
		...StatsColumnsDef(),
		...RPSColumnsDef(),
		...OwesColumnsDef(),
		colDef('Next Appointment'),
	],
	'Primary Insurer': [
		colDef(getPrimaryColumnName('Primary Insurer')),
		...StatsColumnsDef(),
		...RPSColumnsDef(),
	],
	'Secondary Insurer': [
		colDef(getPrimaryColumnName('Secondary Insurer')),
		...StatsColumnsDef(),
		...RPSColumnsDef(),
	],
	'Service Type': [
		colDef(getPrimaryColumnName('Service Type')),
		...StatsColumnsDef(),
	],
	'Write Offs': [
		colDef(getPrimaryColumnName('Write Offs')),
		...OwesColumnsDef(),
	],
};
