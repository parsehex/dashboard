import { format } from 'date-fns';
// import type { TherapyNotesRow } from '@/types/file-data/therapy-notes';
import { loadSpreadsheetFile } from '@/lib/io';
import { newDateFromExcel, uniqObjectArray } from '@/lib/utils';
// import { perfMark, perfMeasure } from '@/lib/devtools';

export default async function processTherapyNotesData(
	buffers: ArrayBuffer[],
	priorData?: TherapyNotesRow[]
) {
	// perfMark('pTND_start');

	let sheet: TherapyNotesRow[] = [];
	if (priorData) sheet.push(...priorData);

	for (const buffer of buffers) {
		sheet.push(
			...loadSpreadsheetFile<TherapyNotesRow>({
				buffer,
				sheetName: 'Billing Transactions',
				sort: 'Date',
			})
		);
	}

	// add ids to rows
	for (const row of sheet) {
		const id = makeID(row);
		row['ID'] = id;
	}

	sheet = uniqObjectArray(sheet, 'ID');

	return sheet;
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
