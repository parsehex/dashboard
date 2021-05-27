import validatePayrollOptions from './PayrollOptions';
import validateTNBillingStatement from './TNBillingStatement';
import validateTSheetsHoursReport from './TSheetsHoursReport';

export function validateFile(fileType: SupportedFileType, data: Buffer) {
	switch (fileType) {
		case 'PayrollOptions': {
			try {
				return validatePayrollOptions(data);
			} catch (e) {
				return false;
			}
		}
		case 'TNBillingStatement': {
			try {
				return validateTNBillingStatement(data);
			} catch (e) {
				return false;
			}
		}
		case 'TSheetsHoursReport': {
			try {
				return validateTSheetsHoursReport(data);
			} catch (e) {
				return false;
			}
		}
	}
}
