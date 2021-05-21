export const Presets: ChartPresets = {
	Employees: [
		{
			type: 'bar-stacked',
			title: 'Admin vs Clin Hours',
			mainColumn: 'Name',
			datasets: [
				{
					key: 'Admin Hrs',
					color: '#2196F3',
				},
				{
					key: 'Clin Hrs',
					color: '#FF9800',
				},
			],
		},
		{
			type: 'pie',
			title: 'Total Gross',
			mainColumn: 'Name',
			datasets: [
				{
					key: 'Total Gross',
					color: '--AUTO--',
				},
			],
		},
	],
};
