<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
  for?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <label
    :for="props.for"
    :class="cn('text-sm font-medium text-[#0a0a0a] leading-none', props.class)"
  >
    <slot />
  </label>
</template>
