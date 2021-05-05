import math from '@/math';
// import type { TableRowObject } from '@/types/components';
// import { TableDataObject } from '@/types/components';
import { $, genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

/** Columns `Total Expected`, `Collect %` */
export default function collected(appts: Appointment[]): TableRowObject {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		genNAColumns(['Total Expected', 'Collected %']);
	}

	const paid: number = math.sum(appts.map((appt) => appt.total.paid));
	const expected: number = math.sum(appts.map((appt) => appt.total.expected));

	let collected = (paid / expected) * 100;
	if (paid === 0) collected = 0;

	return {
		'Total Expected': {
			value: expected,
			text: $(expected),
		},
		'Collected %': {
			value: collected,
			text: Number.isNaN(collected) ? 'N/A' : `${collected.toFixed(2)}%`,
		},
	};
}
