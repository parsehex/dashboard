<template>
	<container fluid>
		<row>
			<column class="nav col-3">
				<app-navigation />
			</column>
			<column class="col-9">
				<router-view />
			</column>
		</row>
	</container>
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
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	/* margin-top: 60px; */
}
.btn-group-xs > .btn,
.btn-xs {
	padding: 0.25rem 0.4rem;
	font-size: 0.875rem;
	line-height: 0.5;
	border-radius: 0.2rem;
}
</style>
