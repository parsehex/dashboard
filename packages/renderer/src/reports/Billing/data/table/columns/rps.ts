import math from '@/math';
import { genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

/** Columns `Total Revenue`, `Total Sessions` */
export default function rps(appts: Appointment[]) {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		return {
			...genNAColumns('Total Revenue'),
			'Total Sessions': 0,
		};
	}

	const totals = appts.map((a) => a.total.paid);
	const sum = math.sum(totals);
	const sessions = totals.length;

	return {
		'Total Revenue': sum,
		'Total Sessions': sessions,
	};
}
