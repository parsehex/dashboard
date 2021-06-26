import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';
import { clone } from '@/lib/utils';
import { sum } from 'simple-statistics';

const Blank = {
	'Total Revenue': 0,
	'Total Sessions': 0,
};

/** Columns `Total Revenue`, `Total Sessions` */
export default function rps(appts: Appointment[]) {
	appts = pastAppts(appts);
	if (appts.length === 0) return clone(Blank);

	const totals = appts.map((a) => a.total.paid);
	const total = sum(totals);
	const sessions = totals.length;

	return {
		'Total Revenue': total,
		'Total Sessions': sessions,
	};
}
