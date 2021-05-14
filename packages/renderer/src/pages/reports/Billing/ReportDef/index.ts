interface StatsColumns {
	Average: number;
	Q1: number;
	Median: number;
	Q3: number;
	IQR: number;
}
interface RPSColumns {
	'Total Revenue': number;
	'Total Sessions': number;
}
interface PaidColumns {
	'Patient Paid': number;
	'Insurance Paid': number;
	'Paid Total': number;
}
interface OwesColumns {
	'Patient Owes': number;
	'Insurance Owes': number;
	'Total Owes': number;
}

interface PercentCollected extends PaidColumns {
	'Patient Name': string;
	'Total Expected': number;
	'Collected %': number;
}
interface AppointmentType extends StatsColumns {
	'Appointment Type': string;
}
interface BillingMethod extends StatsColumns {
	'Billing Method': string;
}
interface Clinician extends StatsColumns, RPSColumns {
	'Clinician Name': string;
}
interface Month extends StatsColumns, RPSColumns {
	Month: string;
}
interface Patient extends StatsColumns, RPSColumns, OwesColumns {
	'Patient Name': string;
	'Next Appointment': string;
}
interface PrimaryInsurer extends StatsColumns, RPSColumns {
	'Primary Insurer': string;
}
interface SecondaryInsurer extends StatsColumns, RPSColumns {
	'Secondary Insurer': string;
}
interface ServiceType extends StatsColumns {
	'Service Description': string;
}
interface WriteOffs extends OwesColumns {
	'Patient Name': string;
}

export type Report = {
	'% Collected': PercentCollected[];
	'Appointment Type': AppointmentType[];
	'Billing Method': BillingMethod[];
	Clinician: Clinician[];
	Month: Month[];
	Patient: Patient[];
	'Primary Insurer': PrimaryInsurer[];
	'Secondary Insurer': SecondaryInsurer[];
	'Service Type': ServiceType[];
	'Write Offs': WriteOffs[];
	[sheetName: string]: any;
};

export { Presets } from './chart';
export { Columns } from './spreadsheet';
