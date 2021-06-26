import {
	interquartileRange,
	quantile,
	average,
	median,
} from 'simple-statistics';
import { clone } from '@/lib/utils';
import type { Appointment } from '../../parse';
import { pastAppts } from '../../filter';

const Blank = {
	Average: 0,
	Q1: 0,
	Median: 0,
	Q3: 0,
	IQR: 0,
};

export default function basicStats(appts: Appointment[]) {
	appts = pastAppts(appts);
	if (appts.length === 0) return clone(Blank);

	const totals = appts.map((a) => a.total.paid);

	const mean = average(totals);
	const med = median(totals);
	const q1 = quantile(totals, 0.25);
	const q3 = quantile(totals, 0.75);
	const iqr = interquartileRange(totals);

	return {
		Average: mean,
		Q1: q1,
		Median: med,
		Q3: q3,
		IQR: iqr,
	};
}
