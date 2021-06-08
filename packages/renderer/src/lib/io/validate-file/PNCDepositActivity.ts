import FileValidator from './_FileValidator';

export default class PNCDepositActivity extends FileValidator {
	protected static NameRegex = /depositAcitivityExport-.*\.csv/;
	protected static Sheets = ['depositActivityExport-*'];
	protected static Columns = {
		'depositActivityExport-*': [
			'Date',
			'Decription',
			'Withdrawals',
			'Deposits',
			'Balance',
		],
	};
}
