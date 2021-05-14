import { interquartileRange, quantile } from 'simple-statistics';
import math from '@/math';
import { genNAColumns } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

export default function basicStats(appts: Appointment[]) {
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
		Average: average,
		Q1: q1,
		Median: median,
		Q3: q3,
		IQR: iqr,
	};
}
