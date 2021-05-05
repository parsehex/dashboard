interface TherapyNotesRow {
	/**
	 * This is generated from:
	 *
	 * Date + "-" + Clinician Name + "-" + Last Name + First Name
	 */
	ID?: string;
	'Appointment Type': string;
	'Bill as Supervisor': string;
	'Billing Method': string;
	'Clinician NPI': string;
	'Clinician Name': string;
	'Clinician Type': string;
	DOB: string;
	Date: number;
	'First Name': string;
	'In Network': string;
	'Insurance Amount Due': number;
	'Insurance Amount Paid': number;
	'Insurance Balance Status': string;
	'Last Name': string;
	Location: string;
	'Note Status': string;
	'Patient Amount Due': number;
	'Patient Amount Paid': number;
	'Patient Balance Status': string;
	'Patient Member ID': string;
	'Primary Diagnosis': string;
	'Primary Insurer Group': string;
	'Primary Insurer Name': string;
	Rate: number;
	'Secondary Insurer Group': string;
	'Secondary Insurer Name': string;
	'Service Code': string;
	'Service Description': string;
	'Supervisor NPI': string;
	'Supervisor Name': string;
	Type: string;
	Units: number;
}
