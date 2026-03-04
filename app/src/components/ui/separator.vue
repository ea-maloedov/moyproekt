<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
  orientation?: 'horizontal' | 'vertical';
}
const props = withDefaults(defineProps<Props>(), { orientation: 'horizontal' });
</script>

<template>
  <div
    :class="
      cn(
        'bg-[#e4e3dc] shrink-0',
        props.orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        props.class,
      )
    "
  />
</template>
