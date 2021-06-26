declare namespace PayrollOptions {
	export interface HoursLimits {
		Name: string;
		Limit: number;
	}
	export interface BillingCounselorOverride {
		'Patient Name': string;
		'Billing Counselor': string;
		'Rendering Counselor': string;
	}
	export interface Aliases {
		Name: string;
		Alias: string;
	}
	export interface Rates {
		Name: string;
		Admin: number;
		Clin: number;
		IOP: number;
		Holiday: number;
	}
	export interface SalariedEmployees {
		Name: string;
		'Weekly Gross': number;
	}
}
