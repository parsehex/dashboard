import xlsx from 'xlsx';
import { useElectron } from '@/lib/use-electron';

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

export default async function (input: string) {
	const { readFile } = useElectron();
	const data = await readFile(input);
	const wb = xlsx.read(data, { type: 'array' });
	wb.Custprops;

	const report = {};

	return report;
}
