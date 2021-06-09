<template>
	<div>
		<alert v-if="!dir" type="primary">
			First you must choose a folder to keep data files in.
			<br />
			<help-link class="btn btn-info" page="data-dir">Learn More</help-link>
			<btn type="primary" @click="pick">Choose folder</btn>
		</alert>
		<span v-else>&lt; Open a report in the sidebar</span>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Alert from '@/components/common/Alert.vue';
import state from '@/state';
import { useElectron } from '@/lib/use-electron';

export default defineComponent({
	name: 'Home',
	components: { Alert },
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
