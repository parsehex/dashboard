import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '@/pages/Home.vue';

const routes = [
	{ path: '/', name: 'Home', component: Home },
	{
		path: '/about',
		name: 'About',
		component: () => import('@/pages/About.vue'),
	},
	{
		path: '/report/payroll-hours',
		name: 'Payroll Hours Report',
		component: () => import('@/reports/PayrollHours/PayrollHours.vue'),
	},
	{
		path: '/report/payroll',
		name: 'Weekly Payroll Report',
		component: () => import('@/reports/WeeklyPayroll/WeeklyPayroll.vue'),
	},
	{
		path: '/report/weekly-transfers',
		name: 'Weekly Transfers Report',
		component: () => import('@/reports/WeeklyTransfers/WeeklyTransfers.vue'),
	},
	{
		path: '/report/billing-tn',
		name: 'Billing Report',
		component: () => import('@/reports/Billing/Billing.vue'),
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
