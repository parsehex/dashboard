import xlsx from 'xlsx';

const RequiredSheets = [
	'Rates',
	'Salaried Employees',
	'Billing Counselor Override',
	'Aliases',
	'Hours Limits',
];

export default function validatePayrollOptions(data: Buffer) {
	const wb = xlsx.read(data, { type: 'array' });
	const { SheetNames } = wb;

	for (const S of RequiredSheets) {
		if (!SheetNames.includes(S)) return false;
	}
	return true;
}
