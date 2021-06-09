const dictionary: Files = {
	// @ts-ignore: i have no clue what the type checker is talking about
	TNBillingStatement: {
		name: {
			print: 'TherapyNotes Billing Statement',
			file: 'TN_Billing_Statement',
			key: 'TNBillingStatement',
		},
	},
	// @ts-ignore: i have no clue what the type checker is talking about
	TSheetsHoursReport: {
		name: {
			print: 'TSheets Hours Report',
			file: 'TSheets_Hours_Report',
			key: 'TSheetsHoursReport',
		},
		help: 'file-types/TSheetsHoursReport',
	},
	// @ts-ignore: i have no clue what the type checker is talking about
	PayrollOptions: {
		name: {
			print: 'Payroll Options',
			file: 'Payroll_Options',
			key: 'PayrollOptions',
		},
		help: 'file-types/PayrollOptions',
	},
	// @ts-ignore: i have no clue what the type checker is talking about
	PNCDepositActivity: {
		name: {
			print: 'PNC Deposit Activity',
			file: 'PNC_Deposit_Activity',
			key: 'PNCDepositActivity',
		},
	},
	// @ts-ignore: i have no clue what the type checker is talking about
	PayrollSummary: {
		name: {
			print: 'Payroll Summary',
			file: 'Payroll_Summary',
			key: 'PayrollSummary',
		},
	},
};
const keys = Object.keys(dictionary) as SupportedFileType[];
// @ts-ignore: i have no clue what the type checker is talking about
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
