<template>
  <n-space>
    <n-button
      v-for="(action, index) in actions"
      :key="index"
      :type="action.type"
      :text="action.text"
      :size="action.size"
      :color="action.color"
      @click="() => action.handler(row)"
    >
      {{ action.title }}
    </n-button>
  </n-space>
</template>
<script setup lang="ts">
import type { ActionItem } from './types';

defineProps<{
  actions: ActionItem[];
  row: Common.Recordable;
}>();
</script>
