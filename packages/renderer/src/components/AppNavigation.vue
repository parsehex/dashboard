<template>
	<container class="app-nav" fluid>
		<div v-if="dir" class="items">
			<tree-view :tree="tree" />
			<btn type="warning" size="xs" @click="reload" title="Reload the page">
				<icon type="refresh-cw" :size="20" />
			</btn>
			<help-link size="xs" label="Help" title="Learn how to use this app" />
			<btn v-if="pdfCharts.length > 0" type="success">
				Save {{ pdfCharts.length }} Chart{{ pdfCharts.length > 1 ? 's' : '' }}
				as PDF
			</btn>
		</div>
		<div class="dir input-group mb-3">
			<input
				:value="dir"
				:title="dir"
				type="text"
				class="form-control"
				placeholder="Data folder"
				disabled
			/>
			<div class="input-group-append">
				<span class="input-group-text">
					<btn
						:type="dir ? 'info' : 'primary'"
						size="xs"
						@click="pickDir"
						title="Pick a new folder"
					>
						<icon type="folder-plus" :size="20" color="white" />
					</btn>
				</span>
			</div>
		</div>
		<div class="version-update m-3">
			<span class="version mx-1">v{{ version }}</span>
			<btn class="mx-1" type="info" size="xs" @click="checkUpdate">
				<icon type="refresh-cw" :size="20" color="white" />
			</btn>
			<btn v-if="isUpdateAvailable" class="mx-1" type="success" @click="update">
				Update now (restarts automatically)
			</btn>
		</div>
	</container>
</template>

<script lang="ts">
import { useElectron } from '@/lib/use-electron';
import state from '@/state';
import { defineComponent } from 'vue';
import TreeView from './common/TreeView.vue';
import { reportsTree } from '@/lib/reports';

export default defineComponent({
	name: 'AppNavigation',
	components: { TreeView },
	data: () => ({ tree: reportsTree }),
	computed: {
		pdfCharts: () => state.chartsToExport,
		dir: () => state.dir,
		version: () => state.version,
		isUpdateAvailable: () => state.isUpdateAvailable,
	},
	methods: {
		reload: () => {
			window.location.reload();
		},
		pickDir: async () => {
			await useElectron().pickDir();
		},
		update: async () => {
			await useElectron().ipcRenderer.invoke('update');
		},

		checkUpdate: async () => {
			await useElectron().ipcRenderer.invoke('check-update');
		},
	},
});
</script>

<style lang="scss" scoped>
.app-nav {
	.input-group-text {
		padding-top: 0 !important;
		padding-bottom: 0 !important;
	}
	.dir {
		margin-top: 1rem;
		.btn {
			padding: 0;
		}
	}
}
</style>
