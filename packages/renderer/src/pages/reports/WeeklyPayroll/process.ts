import xlsx from 'xlsx';
import { colDef } from '@/lib/utils';

interface EmployeeRow {
	Name: string;
	'Vaca Hrs': number;
	'Admin Hrs': number;
	'Admin Rate': number;
	'Admin Gross': number;
	'Clin Hrs': number;
	'Clin Rate': number;
	'Clin Gross': number;
	'IOP Rate': number;
	'IOP Reg Hrs': number;
	'Total Hrs': number;
	'Total Gross': number;
}
export type Report = { Employees: EmployeeRow[] };

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [
		colDef('Name'),
		colDef('Vaca Hrs'),
		colDef('Admin Hrs'),
		colDef('Admin Rate'),
		colDef('Admin Gross'),
		colDef('Clin Hrs'),
		colDef('Clin Rate'),
		colDef('Clin Gross'),
		colDef('IOP Rate'),
		colDef('IOP Reg Hrs'),
		colDef('Total Hrs'),
		colDef('Total Gross'),
	],
};

interface ReportFilePaths {
	options: Buffer;
	hours: Buffer;
	billing: Buffer;
}

export default async function (input: ReportFilePaths): Promise<Report> {
	const files: any = {
		billing: [],
		medicare: [],
		hours: [],
		limits: [],
		rates: [],
		salaried: [],
		aliases: [],
	};

	const billingWb = xlsx.read(input.billing, { type: 'array' });
	const hoursWb = xlsx.read(input.hours, { type: 'array' });
	const optionsWb = xlsx.read(input.options, { type: 'array' });

	files.billing = xlsx.utils.sheet_to_json(
		billingWb.Sheets[billingWb.SheetNames[0]]
	);

	files.hours = xlsx.utils.sheet_to_json(
		hoursWb.Sheets[hoursWb.SheetNames[0]],
		{
			header: [
				'payroll_id',
				'type',
				'hours',
				'total_seconds',
				'username',
				'number',
				'fname',
				'lname',
				'group_name',
				'start_date',
				'end_date',
				'approved_thru',
				'submitted_thru',
			],
		}
	);

	// first 2 rows are header, not data
	files.hours.shift();
	files.hours.shift();

	if (optionsWb.SheetNames.includes('Billing Counselor Override'))
		files.medicare = xlsx.utils.sheet_to_json(
			optionsWb.Sheets['Billing Counselor Override']
		);

	if (optionsWb.SheetNames.includes('Hours Limits'))
		files.limits = xlsx.utils.sheet_to_json(optionsWb.Sheets['Hours Limits']);

	files.salaried = xlsx.utils.sheet_to_json(
		optionsWb.Sheets['Salaried Employees']
	);
	files.rates = xlsx.utils.sheet_to_json(optionsWb.Sheets['Rates']);

	if (optionsWb.SheetNames.includes('Aliases'))
		files.aliases = xlsx.utils.sheet_to_json(optionsWb.Sheets['Aliases']);

	const report: Report = {
		Employees: [],
	};

	const resolveAlias = (n: string) => {
		for (const a of files.aliases) {
			if (a.Alias === n) return a.Name;
		}

		// no alias found
		return n;
	};

	const findEmp = (Name: string) => {
		Name = resolveAlias(Name);

		for (const e of report.Employees) {
			if (e.Name === Name) return e;
		}

		// if employee can't be found, create one and add it
		const e: EmployeeRow = {
			Name,
			'Vaca Hrs': 0,
			'Admin Hrs': 0,
			'Admin Rate': 0,
			'Admin Gross': 0,
			'Clin Hrs': 0,
			'Clin Rate': 0,
			'Clin Gross': 0,
			'IOP Rate': 0,
			'IOP Reg Hrs': 0,
			'Total Hrs': 0,
			'Total Gross': 0,
		};
		report.Employees.push(e);
		return e;
	};
	const lookupMedicare = (
		/** Format: "FIRST LAST" */
		patientName: string,
		counselor: string
	): string | false => {
		for (const row of files.medicare) {
			const pNameArr = row['Patient Name'].split(' ');
			const patientFirst_Last =
				pNameArr[0] + ' ' + pNameArr[pNameArr.length - 1];
			if (
				patientFirst_Last.toLowerCase() === patientName.toLowerCase() &&
				counselor === row['Billing Counselor']
			)
				return row['Rendering Counselor'];
		}
		return false;
	};
	const getLimit = (name: string) => {
		name = resolveAlias(name);

		for (const l of files.limits) {
			if (l.Name === name) return l.Limit;
		}
		return false;
	};
	const isSalaried = (name: string) => {
		name = resolveAlias(name);

		for (const e of files.salaried) {
			if (e.Name === name) return true;
		}
		return false;
	};

	for (const e of files.rates) {
		const E = findEmp(e.Name);
		console.log(e.Name);
		E['Admin Rate'] = e.Admin;
		E['Clin Rate'] = e.Clin;

		// use IOP col if theres a value
		// otherwise use Clin
		// otherwise use Admin
		E['IOP Rate'] = e.IOP ? e.IOP : e.Clin || e.Admin;
	}

	for (const e of files.hours) {
		const name = e.fname + ' ' + e.lname;
		const E = findEmp(name);

		if (e.type === 'REG') {
			E['Admin Hrs'] = e.hours;
		} else {
			E['Vaca Hrs'] = e.hours;
		}
	}

	for (const appt of files.billing) {
		if (appt['Type'] !== 'Appointment') continue;
		const patient = appt['First Name'] + ' ' + appt['Last Name'];
		const realCounselor = lookupMedicare(patient, appt['Clinician Name']);
		const E = realCounselor
			? findEmp(realCounselor)
			: findEmp(appt['Clinician Name']);

		let hrs = 0;
		if (appt['Service Code'] === '90832') hrs = 0.5;
		else if (appt['Service Code']?.indexOf('908') === 0) hrs = 1;
		E['Clin Hrs'] += hrs;
	}

	for (const E of report.Employees) {
		if (isSalaried(E.Name)) {
			E['Admin Hrs'] = Math.max(40 - E['Clin Hrs'], 0);
		}

		// final pass, make totals
		let total = E['Admin Hrs'] + E['Clin Hrs'] + E['Vaca Hrs'];
		const cap = getLimit(E.Name);
		if (cap !== false && total > cap) total = cap;
		E['Total Hrs'] = total;

		if (E['Admin Hrs']) {
			E['Admin Gross'] = E['Admin Hrs'] * E['Admin Rate'];
			E['Admin Gross'] = +E['Admin Gross'].toFixed(2);
		}
		if (E['Clin Hrs']) {
			E['Clin Gross'] = E['Clin Hrs'] * E['Clin Rate'];
		}

		E['Total Gross'] = (E['Clin Gross'] || 0) + (E['Admin Gross'] || 0);
		if (E['IOP Rate'] > 0) E['Total Gross'] += E['Vaca Hrs'] * E['IOP Rate'];
		E['IOP Reg Hrs'] = E['Total Gross'] / E['IOP Rate'];

		// tidy up rounding errors
		E['Total Hrs'] = +E['Total Hrs'].toFixed(2);
		E['Clin Gross'] = +E['Clin Gross'].toFixed(2);
		E['Total Gross'] = +E['Total Gross'].toFixed(2);
		E['IOP Reg Hrs'] = +E['IOP Reg Hrs'].toFixed(2);
	}

	return report;
}
