<template>
	<div class="app-container container-fluid">
		<row>
			<column v-if="$route.path !== '/'" class="nav col-3">
				<app-navigation />
			</column>
			<column
				:class="{
					'page col-9': $route.path !== '/',
					'page col-12': $route.path === '/',
				}"
			>
				<router-view />
			</column>
		</row>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppNavigation from '@/components/AppNavigation.vue';

export default defineComponent({
	name: 'App',
	components: {
		AppNavigation,
	},
});
</script>

<style lang="scss">
button.rounded {
	border-radius: 1rem !important;
}
.app-container {
	padding-top: 10px;
	padding-bottom: 10px;
}
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	/* margin-top: 60px; */

	.page {
		height: 100vh;

		.content {
			height: 100%;
			display: flex;
			flex-direction: column;

			& > :last-child:not(:first-child):not(.choose-file):not(.files) {
				flex-grow: 1;

				display: flex;
				flex-direction: column;

				& > :last-child {
					flex-grow: 1;
				}
			}
		}
	}
}

.btn-group-xs > .btn,
.btn-xs {
	padding: 0.05rem;
	font-size: 0.875rem;
	line-height: 0.5;
	border-radius: 0.2rem;
}

.sep {
	cursor: default;
	user-select: none;
}
.hidden {
	visibility: hidden;
}
</style>
