interface AppStore {
	window: {
		width: number;
		height: number;
		x: number;
		y: number;
		maximized: boolean;
	};
	dir: string;
}

interface FileType {
	name: {
		/** Name suitable for showing the user */
		print: string;
		/** URL-friendly name */
		file: string;
		/** Name that should be used in keys for this file type */
		key: SupportedFileType;
	};
	/** Link to help page */
	help?: string;
}
interface _Files {
	[DataSource: string]: FileType;
}
interface Files extends _Files {
	TNBillingStatement: FileType;
	TSheetsHoursReport: FileType;
	PayrollOptions: FileType;
	PayrollSummary: FileType;
	PNCDepositActivity: FileType;
}

type SupportedFileType =
	| 'TNBillingStatement'
	| 'TSheetsHoursReport'
	| 'PayrollOptions'
	| 'PNCDepositActivity'
	| 'PayrollSummary';
// type FilesList = Record<SupportedFileType, string | string[]>;

interface ReportFolder {
	files: string[];
	[reportName: string]: string[];
}
interface FilesList {
	'Weekly Payroll': ReportFolder;
	'Weekly Transfers': ReportFolder;
	// 'Payroll Hours Breakdown': ReportFolder;
	'Revenue Per Session': ReportFolder;
	[ReportType: string]: ReportFolder;
}

type ReportType =
	| 'Weekly Payroll'
	| 'Weekly Transfers'
	// | 'Payroll Hours Breakdown'
	| 'Revenue Per Session';
