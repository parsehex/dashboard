import FileValidator from './_FileValidator';

export default class PNCDepositActivity extends FileValidator {
	protected static NameRegex =
		/(?:depositActivityExport)|(?:accountDetailByDateExport)-.*\.csv/;
	protected static Sheets = ['/.*/'];
	protected static Columns = {
		'/.*/': ['Date', 'Description', 'Withdrawals', 'Deposits', 'Balance'],
	};
}
