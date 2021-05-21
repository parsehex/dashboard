<template>
	<div class="container-fluid">
		<ul class="nav nav-tabs" role="tablist">
			<li
				v-for="tab in tabList"
				:key="tab"
				class="nav-item"
				role="presentation"
			>
				<button
					:id="id(tab) + '-tab'"
					:ref="tab + '-btn'"
					class="nav-link active"
					data-bs-toggle="tab"
					:data-bs-target="'#' + id(tab)"
					type="button"
					role="tab"
					@click="active = tab"
				>
					{{ tab }}
				</button>
			</li>
		</ul>
		<div class="tab-content">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { strToId } from '@/lib/utils';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'Tabs',
	props: {
		tabList: {
			type: Array as PropType<string[]>,
			required: true,
		},
	},
	data: (props) => ({
		active: props.tabList[0],
		// tab: null,
	}),
	mounted() {
		const $refs = Object.keys(this.$refs);
		for (const r of $refs) {
			const btn = this.$refs[r] as HTMLButtonElement;
			btn.addEventListener('click', () => {
				const t = btn.dataset.bsTarget as string;
				const currentTab = document.querySelector(
					'.tab-pane.active'
				) as HTMLDivElement;
				const targetTab = document.querySelector(t) as HTMLDivElement;

				if (targetTab === currentTab) return;

				targetTab.classList.add('active');
				currentTab.classList.remove('active');
			});
		}
	},
	methods: {
		id: strToId,
	},
});
</script>
