export interface PNCStatementActivityColumn {
	Date: string;
	Amount: number;
	Description: string;
	'Description Cont.': string;
	'Reference No.': number;
	Type: 'DEBIT' | 'CREDIT';
}
