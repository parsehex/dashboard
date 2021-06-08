import xlsx from 'xlsx';
import { Columns, Report } from './ReportDef';
import { Appointment, parseAppointments } from './data/parse';
import { DataMode } from './data/table';
import {
	getPrimaryColumnName,
	getPrimaryColumnValue,
} from './data/table/primary-column';
import basicStats from './data/table/columns/basic-stats';
import collected from './data/table/columns/collected';
import nextAppt from './data/table/columns/next-appointment';
import owes from './data/table/columns/owes';
import paid from './data/table/columns/paid';
import rps from './data/table/columns/rps';
import { filterAppointments } from './data/filter';

const Modes = Object.keys(Columns);

export default async function (input: Buffer): Promise<Report> {
	const wb = xlsx.read(input, { type: 'array' });

	const fileData: TherapyNotesRow[] = xlsx.utils.sheet_to_json(
		wb.Sheets[wb.SheetNames[0]]
	);

	const report = {} as Report;

	for (const m of Modes) {
		const mode = m as DataMode;
		let appts = parseAppointments(fileData);
		appts = filterAppointments(appts, { mode });
		const tResults = results(appts, mode);
		const sheet = tableData(tResults, mode);
		report[mode] = sheet;
	}

	return report;
}

function results(appts: Appointment[], mode: keyof Report) {
	const results: any[] = [];
	for (const appt of appts) {
		const name = getPrimaryColumnValue(appt, mode);
		let result = results.find((v) => v.name === name);
		if (!result) {
			result = {
				cell: getPrimaryColumnName(mode),
				name: name as string,
				appointments: [],
			};
			results.push(result);
		}
		result.appointments.push(appt);
	}
	return results;
}

function tableData(results: any[], mode: keyof Report) {
	if (typeof mode === 'number') {
		console.log('The impossible happened');
		return;
	}

	const tableData: TableData = [];
	for (const result of results) {
		const cols: TableRowObject = {};
		if (!['% Collected', 'Write Offs'].includes(mode)) {
			// almost every mode gets basic stats
			Object.assign(cols, basicStats(result.appointments));
		}
		if (
			[
				'Clinician',
				'Month',
				'Patient',
				'Primary Insurer',
				'Secondary Insurer',
			].includes(mode)
		) {
			Object.assign(cols, rps(result.appointments));
		}
		if (['Patient'].includes(mode)) {
			Object.assign(cols, owes(result.appointments));
			Object.assign(cols, nextAppt(result.appointments));
		}
		if (mode === '% Collected') {
			Object.assign(cols, paid(result.appointments));
			Object.assign(cols, collected(result.appointments));
		}
		if (mode === 'Write Offs') {
			Object.assign(cols, owes(result.appointments));
		}

		// if (mode === 'Clinician') console.log(result);
		tableData.push({
			[getPrimaryColumnName(mode) as string]: result.name,
			...cols,
		});
	}
	return tableData;
}
