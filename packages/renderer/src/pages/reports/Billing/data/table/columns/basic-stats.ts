import { interquartileRange, quantile } from 'simple-statistics';
import math from '@/math';
// import type { TableRowObject } from '@/types/components';
import { $, genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

export default function basicStats(appts: Appointment[]): TableRowObject {
	appts = pastAppts(appts);
	if (appts.length === 0) {
		return genNAColumns(['Average', 'Q1', 'Median', 'Q3', 'IQR']);
	}

	const totals = appts.map((a) => a.total.paid);

	const average = math.mean(...totals);
	const median = math.median(...totals);
	const q1 = quantile(totals, 0.25);
	const q3 = quantile(totals, 0.75);
	const iqr = interquartileRange(totals);

	return {
		Average: {
			text: $(average),
			value: average,
		},
		Q1: {
			text: $(q1),
			value: q1,
		},
		Median: {
			text: $(median),
			value: median,
		},
		Q3: {
			text: $(q3),
			value: q3,
		},
		IQR: {
			text: $(iqr),
			value: iqr,
		},
	};
}
