import PayrollOptions from './PayrollOptions';
import PayrollSummary from './PayrollSummary';
import PNCDepositActivity from './PNCDepositActivity';
import TNBillingStatement from './TNBillingStatement';
import TSheetsHoursReport from './TSheetsHoursReport';

export function validateFile(
	fileType: SupportedFileType,
	data: Buffer | string
) {
	switch (fileType) {
		case 'PayrollOptions': {
			try {
				return PayrollOptions.validate(data);
			} catch (e) {
				return false;
			}
		}
		case 'TNBillingStatement': {
			try {
				return TNBillingStatement.validate(data);
			} catch (e) {
				return false;
			}
		}
		case 'TSheetsHoursReport': {
			try {
				return TSheetsHoursReport.validate(data);
			} catch (e) {
				return false;
			}
		}
		case 'PNCDepositActivity': {
			try {
				return PNCDepositActivity.validate(data);
			} catch (e) {
				return false;
			}
		}
		case 'PayrollSummary': {
			try {
				return PayrollSummary.validate(data);
			} catch (e) {
				return false;
			}
		}
	}
}
