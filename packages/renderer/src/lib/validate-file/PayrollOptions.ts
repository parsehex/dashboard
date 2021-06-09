import FileValidator from './_FileValidator';

export default class PayrollOptions extends FileValidator {
	protected static NameRegex = /Payroll.Options\..*/;
	protected static Sheets = [
		'Rates',
		'Salaried Employees',
		'Billing Counselor Override',
		'Aliases',
		'Hours Limits',
	];
}
