import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';
import { clone } from '@/lib/utils';
import { sum } from 'simple-statistics';

const Blank = {
	'Patient Owes': 0,
	'Insurance Owes': 0,
	'Total Owes': 0,
};

/** Columns `Patient Owes`, `Insurance Owes`, `Total Owes` */
export default function owes(appts: Appointment[]) {
	appts = pastAppts(appts);
	if (appts.length === 0) return clone(Blank);

	const pOwesArr = appts
		.map((appt) => {
			return appt.patient.balance.owes;
		})
		.filter((v) => !!v);
	const pOwesSum = sum(pOwesArr);

	const iOwesArr = appts
		.map((appt) => {
			return appt.insurance.balance.owes;
		})
		.filter((v) => !!v);
	const iOwesSum = sum(iOwesArr);

	// const patientOwes: TableDataObject = {
	// 	value: 0,
	// 	text: $(0),
	// };
	// if (pOwesArr.length > 0) {
	// 	patientOwes.text = $(pOwesSum);
	// 	patientOwes.value = pOwesSum;
	// 	patientOwes.title = `Owed from ${pOwesArr.length} sessions`;
	// }

	// const insuranceOwes: TableDataObject = {
	// 	value: 0,
	// 	text: $(0),
	// };
	// if (iOwesArr.length > 0) {
	// 	insuranceOwes.text = $(iOwesSum);
	// 	insuranceOwes.value = iOwesSum;
	// 	insuranceOwes.title = `Owed from ${iOwesArr.length} sessions`;
	// }

	return {
		'Patient Owes': pOwesSum,
		'Insurance Owes': iOwesSum,
		'Total Owes': pOwesSum + iOwesSum,
	};
}
