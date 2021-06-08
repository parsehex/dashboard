import FileValidator from './_FileValidator';

export default class TNBillingStatement extends FileValidator {
	protected static NameRegex = /TN_Billing-Statement(?:_created-)?.*.xlsx?/;
	protected static Sheets = ['Billing Transactions'];
	protected static Columns = {
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
}
