<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
  modelValue?: string | number;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  id?: string;
}

const props = defineProps<Props>();
defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
  <input
    :id="props.id"
    :type="props.type ?? 'text'"
    :value="props.modelValue"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="
      cn(
        'flex h-10 w-full rounded-[8px] border border-[#e4e3dc] bg-white px-3 py-2 text-sm text-[#0a0a0a] placeholder:text-[#8a8a82] focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent disabled:opacity-50 transition-all',
        props.class,
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
