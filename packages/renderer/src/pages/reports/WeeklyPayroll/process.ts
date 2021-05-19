import xlsx from 'xlsx';
import { useElectron } from '@/lib/use-electron';
import { clone, colDef } from '@/lib/utils';

interface EmployeeRow {
	Name: string;
	'Admin Hrs': number;
	'Admin Rate': number;
	'Admin Gross': number;
	'Clin Hrs': number;
	'Clin Rate': number;
	'Clin Gross': number;
	'IOP Rate': number;
	'IOP Reg Hrs': number;
	'Vaca Hrs': number;
	'Total Hrs': number;
	'Total Gross': number;
}
export type Report = { Employees: EmployeeRow[] };

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [
		colDef('Name'),
		colDef('Admin Hrs'),
		colDef('Admin Rate'),
		colDef('Admin Gross'),
		colDef('Clin Hrs'),
		colDef('Clin Rate'),
		colDef('Clin Gross'),
		colDef('IOP Rate'),
		colDef('IOP Reg Hrs'),
		colDef('Vaca Hrs'),
		colDef('Total Hrs'),
		colDef('Total Gross'),
	],
};

interface ReportFilePaths {
	options: string;
	hours: string;
	billing: string;
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
	const { readFile } = useElectron();

	const data1 = await readFile(input.billing);
	const wb1 = xlsx.read(data1, { type: 'array' });
	files.billing = xlsx.utils.sheet_to_json(wb1.Sheets[wb1.SheetNames[0]]);

	const data2 = await readFile(input.hours);
	const wb2 = xlsx.read(data2, { type: 'array' });
	files.hours = xlsx.utils.sheet_to_json(wb2.Sheets[wb2.SheetNames[0]], {
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
	});
	files.hours.shift();
	files.hours.shift();

	const data3 = await readFile(input.options);
	const wb3 = xlsx.read(data3, { type: 'array' });
	files.medicare = xlsx.utils.sheet_to_json(
		wb3.Sheets['Medicare Billing under Alvin']
	);
	files.limits = xlsx.utils.sheet_to_json(wb3.Sheets['Hours Limits']);
	files.salaried = xlsx.utils.sheet_to_json(wb3.Sheets['Salaried Employees']);
	files.rates = xlsx.utils.sheet_to_json(wb3.Sheets['Rates']);
	files.aliases = xlsx.utils.sheet_to_json(wb3.Sheets['Aliases']);

	console.log(files);

	const report: Report = {
		Employees: [],
	};

	const findEmp = (Name: string) => {
		for (const a of files.aliases) {
			// resolve aliases
			if (a.Alias !== Name) continue;
			Name = a.Name;
			break;
		}
		for (const e of report.Employees) {
			if (e.Name === Name) return e;
		}
		const e: EmployeeRow = {
			Name,
			'Admin Hrs': 0,
			'Admin Rate': 0,
			'Admin Gross': 0,
			'Clin Hrs': 0,
			'Clin Rate': 0,
			'Clin Gross': 0,
			'IOP Rate': 0,
			'IOP Reg Hrs': 0,
			'Vaca Hrs': 0,
			'Total Hrs': 0,
			'Total Gross': 0,
		};
		report.Employees.push(e);
		return e;
	};
	const lookupMedicare = (patientName: string): string | false => {
		for (const row of files.medicare) {
			const N = row['Patient Name'].split(' ');
			const p = N[0] + ' ' + N[1];
			if (p.toLowerCase() === patientName.toLowerCase())
				return row['Rendering Counselor'];
		}
		return false;
	};
	const getLimit = (name: string) => {
		for (const l of files.limits) {
			if (l.Name === name) return l.Limit;
		}
		return false;
	};
	const isSalaried = (name: string) => {
		for (const e of files.salaried) {
			if (e.Name === name) return true;
		}
		return false;
	};

	for (const e of files.rates) {
		const E = findEmp(e.Name);
		E['Admin Rate'] = e.Admin;
		E['Clin Rate'] = e.Clin;
		E['IOP Rate'] = e.Clin || e.Admin;
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
		const patient = appt['First Name'] + ' ' + appt['Last Name'];
		const realCounselor = lookupMedicare(patient);
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
			E['Admin Hrs'] = 40 - E['Clin Hrs'];
		}

		// final pass, make totals
		let total = E['Admin Hrs'] + E['Clin Hrs'] + E['Vaca Hrs'];
		const cap = getLimit(E.Name);
		if (cap !== false && total > cap) total = cap;
		E['Total Hrs'] = total;

		if (E['Admin Hrs']) E['Admin Gross'] = E['Admin Hrs'] * E['Admin Rate'];
		if (E['Clin Hrs']) E['Clin Gross'] = E['Clin Hrs'] * E['Clin Rate'];
		E['Total Gross'] = (E['Clin Gross'] || 0) + (E['Admin Gross'] || 0);
		E['IOP Reg Hrs'] = E['Total Gross'] / E['IOP Rate'];
	}

	console.log(clone(report));

	return report;
}
