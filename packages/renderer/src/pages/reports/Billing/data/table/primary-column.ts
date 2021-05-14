import { format } from 'date-fns';
import type { Appointment } from '../parse';
import { Report } from '../../ReportDef';

export function getPrimaryColumnName(mode: keyof Report): string {
	switch (mode) {
		case '% Collected':
		case 'Patient':
		case 'Write Offs':
			return 'Patient Name';

		case 'Clinician':
			return 'Clinician Name';

		case 'Service Type':
			return 'Service Type';

		case 'Appointment Type':
		case 'Billing Method':
		case 'Month':
		case 'Primary Insurer':
		case 'Secondary Insurer':
			return mode;

		default:
			throw new Error(`Unknown mode ${mode}`);
	}
}

export function getPrimaryColumnValue(appt: Appointment, mode: keyof Report) {
	switch (mode) {
		case '% Collected': {
			return appt.patient.name;
		}
		case 'Appointment Type': {
			return appt.type;
		}
		case 'Billing Method': {
			return appt.billingMethod;
		}
		case 'Clinician': {
			return appt.clinician;
		}
		case 'Month': {
			return format(appt.date, 'MMMM, yyyy');
		}
		case 'Patient': {
			return appt.patient.name;
		}
		case 'Primary Insurer': {
			return appt.insurance.primaryName;
		}
		case 'Secondary Insurer': {
			return appt.insurance.secondaryName;
		}
		case 'Service Type': {
			return appt.serviceType;
		}
		case 'Write Offs': {
			return appt.patient.name;
		}

		default:
			throw new Error(`Unknown mode ${mode}`);
	}
}
