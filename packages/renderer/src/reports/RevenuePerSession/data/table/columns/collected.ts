import { clone } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';
import { sum } from 'simple-statistics';

const Blank = {
	'Total Expected': 0,
	'% Collected': 'N/A',
};

/** Columns `Total Expected`, `Collect %` */
export default function collected(appts: Appointment[]) {
	appts = pastAppts(appts);
	if (appts.length === 0) return clone(Blank);

	const paid = sum(appts.map((appt) => appt.total.paid)) || 0;
	const expected = sum(appts.map((appt) => appt.total.expected)) || 0;

	if (paid === 0 && expected === 0) return clone(Blank);

	let collected = paid / expected;
	if (paid === 0) collected = 0;

	return {
		'Total Expected': expected,
		'% Collected': collected,
	};
}
