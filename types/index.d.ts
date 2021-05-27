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
}
interface _Files {
	[DataSource: string]: FileType;
}
interface Files extends _Files {
	TNBillingStatement: FileType;
	TSheetsHoursReport: FileType;
	PayrollOptions: FileType;
}

type SupportedFileType =
	| 'TNBillingStatement'
	| 'TSheetsHoursReport'
	| 'PayrollOptions';
type FilesList = Record<keyof Files, string | string[]>;
