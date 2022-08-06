<template>
  <hover-container
    tooltip-content="github"
    class="w-40px h-full pb-2"
    :inverted="theme.header.inverted"
    @click="handleClickLink"
  >
    <!-- <icon-line-md-github-loop class="text-20px" /> -->
		<n-icon >
			<icon icon="line-md:github-loop" class="text-20px" />
		</n-icon>
  </hover-container>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store';
import { NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';

const theme = useThemeStore();
function handleClickLink() {
  window.open('https://github.com/honghuangdc/soybean-admin', '_blank');
}
</script>

<style scoped></style>
