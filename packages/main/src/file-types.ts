const dictionary: Files = {
	TNBillingStatement: {
		name: {
			print: 'TherapyNotes Billing Statement',
			file: 'TN_Billing_Statement',
			key: 'TNBillingStatement',
		},
	},
	TSheetsHoursReport: {
		name: {
			print: 'TSheets Hours Report',
			file: 'TSheets_Hours_Report',
			key: 'TSheetsHoursReport',
		},
	},
	PayrollOptions: {
		name: {
			print: 'Payroll Options',
			file: 'Payroll_Options',
			key: 'PayrollOptions',
		},
	},
};
const keys = Object.keys(dictionary) as SupportedFileType[];
const fileKeyLookup = keys.map((key) => ({
	file: dictionary[key].name.file,
	key,
}));

const FileTypes = {
	dictionary,
	keys,
	fileKeyLookup,
};
export default FileTypes;

export function isValidFileType(s: string): s is SupportedFileType {
	return keys.includes(s as any);
}

export function getKeyFromFile(file: string) {
	for (const f of fileKeyLookup) {
		if (f.file === file) return f.key;
	}
}
