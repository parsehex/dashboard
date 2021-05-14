import xlsx from 'xlsx';
import { useElectron } from '@/lib/use-electron';
import { colDef, inObj } from '@/lib/utils';

interface EmployeeRow {
	Name: string;
	Admin: number;
	'Admin %': string;
	Clin: number;
	'Clin %': string;
	'Total Hrs': number;
	Gross: number;
}
interface TotalsRow {
	Period: string;
	Admin: number;
	Clin: number;
	Gross: number;
}
export type Report = { Employees: EmployeeRow[]; Totals: TotalsRow[] };

const MainPreset = (mainColumn: string): ChartComponentConfigPreset => ({
	type: 'bar-stacked',
	title: 'Payroll hours by Admin vs Clin',
	mainColumn,
	datasets: [
		{
			key: 'Admin',
			color: '#2196F3',
		},
		{
			key: 'Clin',
			color: '#FF9800',
		},
	],
});
export const Presets: ChartPresets = {
	Employees: [MainPreset('Name')],
	Totals: [MainPreset('Period')],
};

export const Columns: TabulatorSpreadsheetColumnDefs = {
	Employees: [
		colDef('Name'),
		colDef('Admin'),
		colDef('Admin %', {
			sorter: 'number',
		}),
		colDef('Clin'),
		colDef('Clin %', {
			sorter: 'number',
		}),
		colDef('Total Hrs'),
		colDef('Gross', {
			formatter: 'money',
		}),
	],
	Totals: [
		colDef('Period'),
		colDef('Admin'),
		colDef('Clin'),
		colDef('Gross', {
			formatter: 'money',
		}),
	],
};

export default async function (input: string): Promise<Report> {
	const { readFile } = useElectron();
	const data = await readFile(input);
	const wb = xlsx.read(data, { type: 'array' });

	const totals = [];
	const employeesMap: { [name: string]: Employee } = {};

	for (const sheetName of wb.SheetNames) {
		const map = sumSheet(wb.Sheets[sheetName], sheetName);
		totals.push(map.totals);
		const names = Object.keys(map.employees);
		for (const name of names) {
			if (!inObj(employeesMap, name)) {
				employeesMap[name] = map.employees[name];
				continue;
			}
			const emp = employeesMap[name];
			emp.hours.Admin += map.employees[name].hours.Admin;
			emp.hours.Clin += map.employees[name].hours.Clin;
			emp.totalGross += map.employees[name].totalGross;
			emp.totalHours += map.employees[name].totalHours;
		}
	}

	const employees = Object.values(employeesMap);

	for (const emp of employees) {
		emp.hoursPercent.Admin = emp.hours.Admin / emp.totalHours;
		emp.hoursPercent.Clin = emp.hours.Clin / emp.totalHours;
	}

	const report: Report = {
		Employees: [],
		Totals: [],
	};

	for (const e of employees) {
		report.Employees.push({
			Name: e.name,
			Admin: e.hours.Admin,
			'Admin %': Math.round(e.hoursPercent.Admin * 100) + '%',
			Clin: e.hours.Clin,
			'Clin %': Math.round(e.hoursPercent.Clin * 100) + '%',
			'Total Hrs': e.totalHours,
			Gross: e.totalGross,
		});
	}
	for (const p of totals) {
		report.Totals.push({
			Period: p.period,
			Admin: p.Admin,
			Clin: p.Clin,
			Gross: p.Gross,
		});
	}

	return report;
}

interface Totals {
	period: string;
	Admin: number;
	Clin: number;
	Gross: number;
}
interface Employee {
	hours: {
		Admin: number;
		Clin: number;
	};
	hoursPercent: Employee['hours'];
	totalGross: number;
	totalHours: number;
	name: string;
}
const header = ['A', 'B', 'C', 'D', 'E', '', 'G', 'H', 'I', 'J', '', 'L'];
function sumSheet(s: xlsx.WorkSheet, name: string) {
	const rows: GenericObject[] = xlsx.utils.sheet_to_json(s, {
		header,
	});
	const totals: Totals = { period: name, Gross: 0, Admin: 0, Clin: 0 };
	const employees: { [name: string]: Employee } = {};

	for (const r of rows) {
		const { A, B, C, D, E } = r;

		if (B === 'Total') {
			totals.Admin = C;
			totals.Clin = D;
			totals.Gross = E;
		}

		// column A with value is where table starts/ends
		if (!A) continue;

		let employee: Employee = employees[B];
		if (!employee) {
			employee = {
				hours: { Admin: 0, Clin: 0 },
				hoursPercent: { Admin: 0, Clin: 0 },
				totalHours: 0,
				totalGross: 0,
				name: B,
			};
			employees[B] = employee;
		}

		if (C) {
			employee.hours.Admin += +C;
			employee.totalHours += +C;
		}
		if (D) {
			employee.hours.Clin += +D;
			employee.totalHours += +D;
		}
		employee.totalGross += +E;
	}
	return { employees, totals };
}
