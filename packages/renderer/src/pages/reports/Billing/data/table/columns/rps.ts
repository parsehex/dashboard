import numeral from 'numeral';
// import type { TableRowObject } from '@/types/components';
import math from '@/math';
import { $, genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

/** Columns `Total Revenue`, `Total Sessions` */
export default function rps(appts: Appointment[]): TableRowObject {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		return {
			...genNAColumns('Total Revenue'),
			'Total Sessions': {
				value: 0,
			},
		};
	}

	const totals = appts.map((a) => a.total.paid);
	const sum = math.sum(totals);
	const sessions = totals.length;

	return {
		'Total Revenue': {
			text: $(sum),
			value: sum,
		},
		'Total Sessions': {
			text: numeral(sessions).format('0,0'),
			value: sessions,
		},
	};
}
