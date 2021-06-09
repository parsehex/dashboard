import FileValidator from './_FileValidator';

export default class PNCDepositActivity extends FileValidator {
	protected static NameRegex = /depositActivityExport-.*\.csv/;
	protected static Sheets = ['/depositActivityExport-.*/'];
	protected static Columns = {
		'/depositActivityExport-.*/': [
			'Date',
			'Description',
			'Withdrawals',
			'Deposits',
			'Balance',
		],
	};
}
