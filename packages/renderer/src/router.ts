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
		component: () => import('@/pages/reports/Payroll/Payroll.vue'),
	},
	{
		path: '/report/payroll',
		name: 'Weekly Payroll',
		component: () => import('@/pages/reports/WeeklyPayroll/WeeklyPayroll.vue'),
	},
	{
		path: '/report/billing-tn',
		name: 'Billing Report',
		component: () => import('@/pages/reports/Billing/Billing.vue'),
	},
];

export default createRouter({
	routes,
	history: createWebHashHistory(),
});
