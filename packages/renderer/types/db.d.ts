type FileType =
	| 'therapy_notes_spreadsheet'
	| 'pnc_statement_activity'
	| 'intakeq_audit_trail';

interface DBFileObject<FileDataType> {
	file_id: string;
	name: string;
	file_names: string[];
	type: FileType;
	content: FileDataType;
	last_opened: number;
	first_opened: number;
	version: number;
}
