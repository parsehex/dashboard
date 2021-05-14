export const Presets: ChartPresets = {
	'% Collected': [],
	'Appointment Type': [],
	'Billing Method': [],
	Clinician: [
		{
			type: 'pie',
			title: 'Clinician',
			mainColumn: 'Clinician Name',
			datasets: [
				{
					key: 'Total Revenue',
					color: '--AUTO--',
				},
			],
		},
	],
	Month: [],
	Patient: [],
	'Primary Insurer': [
		{
			type: 'pie',
			title: 'Primary Insurer',
			mainColumn: 'Primary Insurer',
			datasets: [
				{
					key: 'Total Revenue',
					color: '--AUTO--',
				},
			],
		},
	],
	'Secondary Insurer': [
		{
			type: 'pie',
			title: 'Secondary Insurer',
			mainColumn: 'Secondary Insurer',
			datasets: [
				{
					key: 'Total Revenue',
					color: '--AUTO--',
				},
			],
		},
	],
	'Service Type': [],
	'Write Offs': [],
};
