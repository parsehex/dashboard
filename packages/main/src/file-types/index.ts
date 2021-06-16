const dictionary: Files = {
	TNBillingStatement: {
		name: {
			print: 'TherapyNotes Billing Transactions',
			file: 'TN_Billing_Statement',
			key: 'TNBillingStatement',
		},
		help: 'file-types/TNBillingTransactions',
	},
	TSheetsHoursReport: {
		name: {
			print: 'TSheets Hours Report',
			file: 'TSheets_Hours_Report',
			key: 'TSheetsHoursReport',
		},
		help: 'file-types/TSheetsHoursReport',
	},
	PayrollOptions: {
		name: {
			print: 'Payroll Options',
			file: 'Payroll_Options',
			key: 'PayrollOptions',
		},
		help: 'file-types/PayrollOptions',
	},
	PNCDepositActivity: {
		name: {
			print: 'PNC Deposit Activity',
			file: 'PNC_Deposit_Activity',
			key: 'PNCDepositActivity',
		},
	},
	PayrollSummary: {
		name: {
			print: 'Payroll Summary',
			file: 'Payroll_Summary',
			key: 'PayrollSummary',
		},
		help: 'file-types/PayrollSummary',
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

export const FileFilters: { [ext: string]: Electron.FileFilter } = {
	png: { name: 'PNG files', extensions: ['png'] },
	xlsx: { name: 'XLSX files', extensions: ['xlsx'] },
	csv: { name: 'CSV files', extensions: ['csv'] },
};
