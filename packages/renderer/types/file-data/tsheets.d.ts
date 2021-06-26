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
	export interface TimesheetReport {
		username: string;
		payroll_id: unknown;
		fname: string;
		lname: string;
		number: string;
		group: string;
		local_date: string;
		local_day: string;
		local_start_time: string;
		local_end_time: string;
		tz: number;
		hours: number;
		jobcode: 'Shift Total' | 'Vacation';
		location: string;
		notes?: string;
		approved_status: string;
		has_flags?: unknown;
		flag_types?: unknown;
	}
}
