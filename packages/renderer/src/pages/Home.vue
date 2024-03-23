<template>
	<div>
		<alert v-if="!dir" type="primary">
			First you must choose a folder to keep data files in.
			<br />
			<help-link page="data-dir" label="Learn More" />
			<btn type="primary" @click="pick">Choose folder</btn>
		</alert>
		<span v-else>
			<tree-view :tree="tree" />
		</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Alert from '@/components/common/Alert.vue';
import TreeView from '@/components/common/TreeView.vue';
import state from '@/state';
import { useElectron } from '@/lib/use-electron';
import { reportsTree } from '@/lib/reports';

export default defineComponent({
	name: 'Home',
	components: { Alert, TreeView },
	data: () => {
		const tree = JSON.parse(JSON.stringify(reportsTree));
		tree[0].text = 'Choose a report';
		return { tree };
	},
	computed: {
		dir: () => state.dir,
	},
	methods: {
		pick: async () => {
			await useElectron().pickDir();
		},
	},
});
</script>
