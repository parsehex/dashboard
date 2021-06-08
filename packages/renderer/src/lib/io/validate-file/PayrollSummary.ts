import FileValidator from './_FileValidator';

export default class PayrollSummary extends FileValidator {
	protected static NameRegex = /Payroll Summary \(\d+\).*\.xlsx?/;
	protected static Sheets = ['Payroll Summary'];
	protected static Columns = {
		'Payroll Summary': [
			'Date',
			'Name',
			'Net Amt',
			'Hours',
			'Taxes Withheld',
			'Total Deductions',
			'Company Contributions',
			'Total Pay',
			'Employer Taxes',
			'Total Cost',
			'Check Num',
		],
	};
}
