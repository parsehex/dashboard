import xlsx from 'xlsx';
import { areNamesEqual, isHoliday, sortByLastName } from '@/lib/utils';
import { parse } from 'date-fns';

export default async function (
	input: WeeklyPayroll.InputFilesArg
): Promise<WeeklyPayroll.Report> {
	console.groupCollapsed('process payroll');
	const files: WeeklyPayroll.InputFiles = {
		billing: [],
		medicare: [],
		hours: [],
		limits: [],
		rates: [],
		salaried: [],
		aliases: [],
	};

	const billingWb = xlsx.read(input.billing, { type: 'array' }); // tn billing statement
	const hoursWb = xlsx.read(input.hours, { type: 'array' }); // tsheets hours report
	const optionsWb = xlsx.read(input.options, { type: 'array' }); // payroll options

	files.billing = xlsx.utils.sheet_to_json(
		billingWb.Sheets[billingWb.SheetNames[0]]
	);

	files.hours = xlsx.utils.sheet_to_json(
		hoursWb.Sheets[hoursWb.SheetNames[0]],
		{
			header: [
				'username',
				'payroll_id',
				'fname',
				'lname',
				'number',
				'group',
				'local_date',
				'local_day',
				'local_start_time',
				'local_end_time',
				'tz',
				'hours',
				'jobcode',
				'location',
				'notes',
				'approved_status',
				'has_flags',
				'flag_types',
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

	const report: WeeklyPayroll.Report = {
		Employees: [],
	};

	const resolveAlias = (name: string) => {
		for (const alias of files.aliases) {
			if (areNamesEqual(name, alias.Alias)) return alias.Name;
		}

		// no alias found
		return name;
	};

	const findEmp = (Name: string) => {
		// if (Name.includes('undefined')) debugger;
		Name = resolveAlias(Name);

		for (const emp of report.Employees) {
			if (areNamesEqual(Name, emp.Name)) return emp;
		}

		// TODO remove rate columns

		// if employee can't be found, create one and add it
		const e: WeeklyPayroll.EmployeeRow = {
			Name,
			'IOP Reg Hrs': 0,
			'Vaca Hrs': 0,
			'Holiday Rate': 0,
			'Holiday Hrs': 0,
			'Admin Hrs': 0,
			'Admin Rate': 0,
			'Admin Gross': 0,
			'Clin Hrs': 0,
			'Clin Rate': 0,
			'Clin Gross': 0,
			'IOP Rate': 0,
			'Total Hrs': 0,
			'Total Gross': 0,
		};
		report.Employees.push(e);
		return e;
	};
	const lookupMedicare = (
		patientName: string,
		counselor: string
	): string | false => {
		for (const row of files.medicare) {
			if (
				areNamesEqual(patientName, row['Patient Name']) &&
				areNamesEqual(counselor, row['Billing Counselor'])
			)
				return row['Rendering Counselor'];
		}
		return false;
	};
	const getLimit = (name: string) => {
		name = resolveAlias(name);

		for (const limit of files.limits) {
			if (areNamesEqual(name, limit.Name)) return +limit.Limit;
		}
		return false;
	};
	const isSalaried = (name: string) => {
		name = resolveAlias(name);

		for (const emp of files.salaried) {
			if (areNamesEqual(name, emp.Name)) return true;
		}
		return false;
	};
	const weeklyPay = (name: string) => {
		name = resolveAlias(name);

		for (const emp of files.salaried) {
			if (
				areNamesEqual(name, emp.Name) &&
				typeof emp['Weekly Gross'] === 'number'
			)
				return emp['Weekly Gross'];
		}
		return false;
	};

	for (const rate of files.rates) {
		const E = findEmp(rate.Name);
		E['Admin Rate'] = rate.Admin;
		E['Clin Rate'] = rate.Clin;

		// use IOP col if theres a value
		// otherwise use Clin
		// otherwise use Admin
		E['IOP Rate'] = rate.IOP ? rate.IOP : rate.Clin || rate.Admin;

		E['Holiday Rate'] = rate.Holiday;
	}

	for (const hour of files.hours) {
		const name = hour.fname + ' ' + hour.lname;
		const E = findEmp(name);

		// if (hour.type === 'Vacation') {
		// 	E['Vaca Hrs'] += hour.hours;
		// } else if (hour.type === 'REG') {
		// 	E['Admin Hrs'] += hour.hours;
		// }
		if (hour.jobcode === 'Vacation') {
			E['Vaca Hrs'] += hour.hours;
		} else {
			const start = parse(hour.local_start_time, 'L/d/yyyy k:mm', new Date());
			if (isHoliday(start)) {
				E['Holiday Hrs'] += hour.hours;
			} else {
				E['Admin Hrs'] += hour.hours;
			}
		}
	}

	for (const appt of files.billing) {
		if (appt['Type'] !== 'Appointment') continue;
		const patient = appt['First Name'] + ' ' + appt['Last Name'];
		const realCounselor = lookupMedicare(patient, appt['Clinician Name']);
		const E = realCounselor
			? findEmp(realCounselor)
			: findEmp(appt['Clinician Name']);
		if (realCounselor) {
			console.log('rewrote', appt['Clinician Name'], 'to', realCounselor);
		}

		let hrs = 0;
		if (appt['Service Code'] === '90832') hrs = 0.5;
		else if (appt['Service Code']?.indexOf('908') === 0) hrs = 1;
		E['Clin Hrs'] += hrs;
	}

	for (const E of report.Employees) {
		if (isSalaried(E.Name) && weeklyPay(E.Name) === false) {
			E['Admin Hrs'] = Math.max(40 - E['Clin Hrs'], 0);
		}

		// final pass, make totals
		let total = E['Admin Hrs'] + E['Clin Hrs'] + E['Vaca Hrs'];
		const cap = getLimit(E.Name);
		if (cap !== false && total > cap) total = cap;
		E['Total Hrs'] = total;

		if (E['Admin Hrs'] > 0) {
			E['Admin Gross'] = E['Admin Hrs'] * E['Admin Rate'];
		}
		if (E['Clin Hrs'] > 0) {
			E['Clin Gross'] = E['Clin Hrs'] * E['Clin Rate'];
		}

		if (weeklyPay(E.Name) !== false) {
			E['Total Gross'] = weeklyPay(E.Name) as number;
		} else {
			E['Total Gross'] = (E['Clin Gross'] || 0) + (E['Admin Gross'] || 0);

			// add vaca hrs
			if (E['IOP Rate'] > 0) E['Total Gross'] += E['Vaca Hrs'] * E['IOP Rate'];
			// holiday hrs
			if (E['Holiday Rate'] > 0 && E['Holiday Hrs'] > 0)
				E['Total Gross'] += E['Holiday Hrs'] * E['Holiday Rate'];
		}

		E['IOP Reg Hrs'] = E['Total Gross'] / E['IOP Rate'];

		// tidy up rounding errors
		E['Total Hrs'] = +E['Total Hrs'].toFixed(2);
		E['Admin Gross'] = +E['Admin Gross'].toFixed(2);
		E['Clin Gross'] = +E['Clin Gross'].toFixed(2);
		E['Total Gross'] = +E['Total Gross'].toFixed(2);
		E['IOP Reg Hrs'] = +E['IOP Reg Hrs'].toFixed(2);
	}

	report.Employees.sort((a, b) => sortByLastName(a.Name, b.Name));
	console.groupEnd();

	return report;
}
