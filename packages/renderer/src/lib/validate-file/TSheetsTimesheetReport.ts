import FileValidator from './_FileValidator';

export default class TSheetsTimesheetReport extends FileValidator {
	protected static NameRegex = /timesheet_report_.*\.(?:xlsx?)|(?:csv)/;
	protected static Sheets = ['/.*/'];
	protected static Columns = {
		'/.*/': [
			'username',
			'fname',
			'lname',
			'number',
			'group',
			'local_date',
			'local_day',
			'local_start_time',
			'local_end_time',
			'tz',
			'hours',
			'jobcode',
			'location',
			'approved_status',
		],
	};
}
