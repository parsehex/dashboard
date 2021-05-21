<template>
	<span>
		Choose a folder for data:
		<btn type="primary" @click="pick">Pick Data Folder</btn>
	</span>
	<p>{{ dir || 'No folder selected' }}</p>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { pickDir } from '@/lib/io';
import state from '@/state';

export default defineComponent({
	name: 'Home',
	computed: {
		dir: () => state.dir,
	},
	methods: {
		async pick() {
			await pickDir();
		},
	},
});
</script>
