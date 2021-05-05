import { newDateFromExcel } from '@/lib/utils';

export interface Appointment {
	/** Appointment Type */
	apptID: string;
	type: string;
	clinician: string;
	date: Date;
	billingMethod: string;
	serviceType: string;
	serviceCode: string;

	insurance: {
		primaryName: string;
		secondaryName: string;
		balance: Balance;
	};
	patient: {
		name: string;
		balance: Balance;
	};

	total: {
		due: number;
		paid: number;
		owes: number;
		expected: number;
	};
}
export interface Balance {
	isPaidInFull: boolean;
	isPaidPartial: boolean;
	status: string;
	paid: number;
	due: number;
	owes: number;
}

export function parseAppointments(data: TherapyNotesRow[]): Appointment[] {
	const results: Appointment[] = [];

	for (const row of data) {
		if (row['Type'] !== 'Appointment') continue;
		const patientName = row['First Name'] + ' ' + row['Last Name'];

		const pBalStatus = row['Patient Balance Status'];
		const iBalStatus = row['Insurance Balance Status'];

		const patientDue = Math.abs(row['Patient Amount Due'] || 0);
		const patientPaid = Math.abs(row['Patient Amount Paid'] || 0);
		let patientOwes = patientDue - patientPaid;
		if (pBalStatus?.toLowerCase() === 'paid in full') patientOwes = 0;

		const insuranceDue = Math.abs(row['Insurance Amount Due'] || 0);
		const insurancePaid = Math.abs(row['Insurance Amount Paid'] || 0);
		let insuranceOwes = insuranceDue - insurancePaid;
		if (iBalStatus?.toLowerCase() === 'paid') insuranceOwes = 0;

		const serviceCode = row['Service Code'];

		let expected = 0;
		if (['90837', '90834', '90846', '90847'].includes(serviceCode))
			expected = 80;
		else if (serviceCode === '90832') expected = 40;

		results.push({
			apptID: row['ID'] as string,
			type: row['Appointment Type'],
			clinician: row['Clinician Name'],
			date: newDateFromExcel(row.Date),
			billingMethod: row['Billing Method'],
			serviceType: row['Service Description'],
			serviceCode,
			insurance: {
				primaryName: row['Primary Insurer Name'] || 'No Insurance',
				secondaryName: row['Secondary Insurer Name'] || 'No Insurance',
				balance: {
					status: iBalStatus,
					isPaidInFull: iBalStatus === 'Paid',
					isPaidPartial: insurancePaid < insuranceDue,
					due: insuranceDue,
					paid: insurancePaid,
					owes: insuranceOwes,
				},
			},
			patient: {
				name: patientName.replace(/\*/g, ''),
				balance: {
					status: pBalStatus,
					isPaidInFull: pBalStatus === 'Paid in Full',
					isPaidPartial: patientPaid < patientDue,
					due: patientDue,
					paid: patientPaid,
					owes: patientOwes,
				},
			},
			total: {
				paid: insurancePaid + patientPaid,
				due: insuranceDue + patientDue,
				owes: insuranceOwes + patientOwes,
				expected,
			},
		});
	}

	return results;
}
