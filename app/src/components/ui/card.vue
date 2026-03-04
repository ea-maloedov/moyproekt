<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}
const props = defineProps<Props>();
</script>

<template>
  <div :class="cn('rounded-[12px] border border-[#e4e3dc] bg-white', props.class)">
    <slot />
  </div>
</template>
