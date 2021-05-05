import math from '@/math';
// import type { TableDataObject, TableRowObject } from '@/types/components';
import { $,  genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

/** Columns `Patient Owes`, `Insurance Owes`, `Total Owes` */
export default function owes(appts: Appointment[]): TableRowObject {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		return genNAColumns(['Patient Owes', 'Insurance Owes', 'Total Owes']);
	}

	const pOwesArr = appts
		.map((appt) => {
			return appt.patient.balance.owes;
		})
		.filter((v) => !!v);
	const pOwesSum = math.sum(pOwesArr);

	const iOwesArr = appts
		.map((appt) => {
			return appt.insurance.balance.owes;
		})
		.filter((v) => !!v);
	const iOwesSum = math.sum(iOwesArr);

	const patientOwes: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (pOwesArr.length > 0) {
		patientOwes.text = $(pOwesSum);
		patientOwes.value = pOwesSum;
		patientOwes.title = `Owed from ${pOwesArr.length} sessions`;
	}

	const insuranceOwes: TableDataObject = {
		value: 0,
		text: $(0),
	};
	if (iOwesArr.length > 0) {
		insuranceOwes.text = $(iOwesSum);
		insuranceOwes.value = iOwesSum;
		insuranceOwes.title = `Owed from ${iOwesArr.length} sessions`;
	}

	return {
		'Patient Owes': patientOwes,
		'Insurance Owes': insuranceOwes,
		'Total Owes': {
			value: pOwesSum + iOwesSum,
			text: $(pOwesSum + iOwesSum),
		},
	};
}
