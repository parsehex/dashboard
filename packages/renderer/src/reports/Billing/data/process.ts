import { format } from 'date-fns';
import { loadSpreadsheetFile } from '@/lib/io';
import { newDateFromExcel, uniqObjectArray } from '@/lib/utils';

export default async function processTherapyNotesData(file: string) {
	const sheet: TherapyNotesRow[] = await loadSpreadsheetFile<TherapyNotesRow>({
		file,
		sheetName: 'Billing Transactions',
		sort: 'Date',
	});

	// add ids to rows
	for (const row of sheet) {
		const id = makeID(row);
		row['ID'] = id;
	}

	return uniqObjectArray(sheet, 'ID');
}

function makeID(row: TherapyNotesRow) {
	let id = '';

	const date = newDateFromExcel(row.Date);
	const dateStr = format(date, 'yyyyMMddHH');

	id += dateStr + '-';
	id += row['Clinician Name'] + '-';
	id += row['Last Name'] + row['First Name'] + '-';
	id += row['DOB'];

	return id;
}
