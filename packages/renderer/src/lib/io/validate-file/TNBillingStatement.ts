import xlsx from 'xlsx';

const RequiredSheets = ['Billing Transactions'];
const RequiredColumns = {
	'Billing Transactions': [
		'Date',
		'Service Code',
		'Last Name',
		'First Name',
		'Clinician Name',
		'Patient Amount Due',
		'Patient Amount Paid',
		'Insurance Amount Due',
		'Insurance Amount Paid',
	],
};

export default function validateTNBillingStatement(data: Buffer) {
	const wb = xlsx.read(data, { type: 'array' });
	const { SheetNames, Sheets } = wb;

	for (const S of RequiredSheets) {
		if (!SheetNames.includes(S)) return false;
	}

	const SN = Object.keys(RequiredColumns);
	for (const S of SN) {
		const data: GenericObject[] = xlsx.utils.sheet_to_json(Sheets[S]);
		const cols = Object.keys(data[0]);
		for (const C of RequiredColumns[S as 'Billing Transactions']) {
			if (!cols.includes(C)) return false;
		}
	}

	return true;
}
