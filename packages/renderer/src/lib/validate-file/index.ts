import PayrollOptions from './PayrollOptions';
import PayrollSummary from './PayrollSummary';
import PNCDepositActivity from './PNCDepositActivity';
import TNBillingStatement from './TNBillingStatement';
import TSheetsHoursReport from './TSheetsHoursReport';
import TSheetsTimesheetReport from './TSheetsTimesheetReport';

export function validateFile(
	fileType: SupportedFileType,
	dataOrFilename: Buffer | string
) {
	switch (fileType) {
		case 'PayrollOptions': {
			try {
				return PayrollOptions.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
		case 'TNBillingStatement': {
			try {
				return TNBillingStatement.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
		case 'TSheetsHoursReport': {
			try {
				return TSheetsHoursReport.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
		case 'TSheetsTimesheetReport': {
			try {
				return TSheetsTimesheetReport.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
		case 'PNCDepositActivity': {
			try {
				return PNCDepositActivity.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
		case 'PayrollSummary': {
			try {
				return PayrollSummary.validate(dataOrFilename);
			} catch (e) {
				return false;
			}
		}
	}
}
