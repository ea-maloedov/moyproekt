<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  disabled?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>();
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="props.modelValue"
    :disabled="props.disabled"
    class="relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563ff] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
    :class="props.modelValue ? 'bg-[#0a0a0a]' : 'bg-[#e4e3dc]'"
    @click="emit('update:modelValue', !props.modelValue)"
  >
    <span
      class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200"
      :class="props.modelValue ? 'translate-x-5' : 'translate-x-0'"
    />
  </button>
</template>
