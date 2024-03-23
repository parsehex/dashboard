import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import About from '@/pages/About.vue';
import PayrollHours from '@/reports/PayrollHours/PayrollHours.vue';
import WeeklyPayroll from '@/reports/WeeklyPayroll/WeeklyPayroll.vue';
import WeeklyTransfers from '@/reports/WeeklyTransfers/WeeklyTransfers.vue';
import Billing from '@/reports/RevenuePerSession/Billing.vue';

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{ path: '/about', name: 'About', component: About },
	{
		path: '/report/payroll-hours',
		name: 'Payroll Hours Report',
		component: PayrollHours,
	},
	{
		path: '/report/payroll',
		name: 'Weekly Payroll Report',
		component: WeeklyPayroll,
	},
	{
		path: '/report/weekly-transfers',
		name: 'Weekly Transfers Report',
		component: WeeklyTransfers,
	},
	{
		path: '/report/billing-tn',
		name: 'Revenue Per Session Report',
		component: Billing,
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
