<template>
	<hover-container class="w-64px h-full" tooltip-content="重新加载" placement="bottom-end" @click="handleRefresh">
		<!-- <icon-mdi-refresh class="text-18px" :class="{ 'animate-spin': loading }" /> -->
		<n-icon v-if="loading">
			<icon icon="line-md:loading-alt-loop" class="text-20px" />
		</n-icon>
		<n-icon v-else>
			<icon icon="line-md:rotate-270" class="text-20px" />
		</n-icon>
	</hover-container>
</template>

<script setup lang="ts">
import { useAppStore } from '@/store';
import { useLoading } from '@/hooks';
import { NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';

const app = useAppStore();
const { loading, startLoading, endLoading } = useLoading();

function handleRefresh() {
	startLoading();
	app.reloadPage();
	setTimeout(() => {
		endLoading();
	}, 1500);
}
</script>

<style scoped>
</style>
