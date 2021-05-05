import math from '@/math';
// import type { TableDataObject, TableRowObject } from '@/types/components';
import { $, genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

/** Columns `Patient Paid`, `Insurance Paid`, `Paid Total` */
export default function paid(appts: Appointment[]): TableRowObject {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		return genNAColumns(['Patient Paid', 'Insurance Paid', 'Paid Total']);
	}

	const pPaid = appts.map((appt) => {
		return appt.patient.balance.paid;
	});
	const patientPaidSum = math.sum(pPaid);

	const iPaid = appts.map((appt) => {
		return appt.insurance.balance.paid;
	});
	const insurancePaidSum = math.sum(iPaid);

	const patientPaid: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (pPaid.length > 0) {
		const sessions = pPaid.filter((v) => v).length;
		patientPaid.text = $(patientPaidSum);
		patientPaid.value = patientPaidSum;
		if (sessions > 0) patientPaid.title = `Paid from ${sessions} sessions`;
	}

	const insurancePaid: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (iPaid.length > 0) {
		insurancePaid.text = $(insurancePaidSum);
		insurancePaid.value = insurancePaidSum;
		insurancePaid.title = `Paid from ${iPaid.length} sessions`;
	}

	return {
		'Patient Paid': patientPaid,
		'Insurance Paid': insurancePaid,
		'Paid Total': {
			value: patientPaidSum + insurancePaidSum,
			text: $(patientPaidSum + insurancePaidSum),
		},
	};
}
