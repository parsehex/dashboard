declare namespace TSheets {
	export interface HoursReport {
		payroll_id: string;
		type: string;
		hours: number;
		total_seconds: number;
		username: string;
		number: string;
		fname: string;
		lname: string;
		group_name: string;
		start_date: string;
		end_date: string;
		approved_thru: string;
		submitted_thru: string;
	}
}
