<template>
  <router-link :to="routeHomePath" class="flex-center w-full nowrap-hidden">
    <transition name="zoom-fade" mode="out-in" appear>
      <div v-if="showTitle" class="flex-center w-full nowrap-hidden">
        <system-logo class="text-32px text-primary" />
        <h2 class="pl-8px text-16px font-bold text-primary transition duration-300 ease-in-out">
          {{ title }}
        </h2>
      </div>
      <system-logo v-else class="text-32px text-primary" />
    </transition>
  </router-link>
</template>

<script setup lang="ts">
import { routePath } from '@/router';
import { useAppInfo } from '@/composables';

interface Props {
  /** 显示名字 */
  showTitle: boolean;
}

defineProps<Props>();

const { title } = useAppInfo();
const routeHomePath = routePath('root');
</script>

<style scoped></style>
