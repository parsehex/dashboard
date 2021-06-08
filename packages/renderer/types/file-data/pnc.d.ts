export interface PNCStatementActivityColumn {
	Date: string;
	Amount: number;
	Description: string;
	'Description Cont.': string;
	'Reference No.': number;
	Type: 'DEBIT' | 'CREDIT';
}

export interface PNCDepositActivity {
	Date: string;
	Description: string;
	Withdrawals: number;
	Deposits: number;
	Balance: number;
}
