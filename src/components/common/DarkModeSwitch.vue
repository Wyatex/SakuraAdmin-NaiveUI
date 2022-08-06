<template>
  <div class="flex-center text-18px cursor-pointer" @click="handleSwitch">
		<n-icon  v-if="darkMode">
			<icon icon="line-md:moon" />
		</n-icon>
		<n-icon v-else >
			<icon icon="line-md:sun-rising-loop" />
		</n-icon>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NIcon } from 'naive-ui';
import { Icon } from '@iconify/vue';

interface Props {
  /** 暗黑模式 */
  dark?: boolean;
}

interface Emits {
  (e: 'update:dark', darkMode: boolean): void;
}

const props = withDefaults(defineProps<Props>(), {
  dark: false
});

const emit = defineEmits<Emits>();

const darkMode = computed({
  get() {
    return props.dark;
  },
  set(newValue: boolean) {
    emit('update:dark', newValue);
  }
});

function handleSwitch() {
  darkMode.value = !darkMode.value;
}
</script>

<style scoped></style>
