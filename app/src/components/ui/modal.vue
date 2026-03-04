<script setup lang="ts">
import { X } from 'lucide-vue-next';

interface Props {
  modelValue?: boolean;
  title?: string;
  maxWidth?: string;
}
const props = withDefaults(defineProps<Props>(), { maxWidth: '500px' });
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>();

function close() {
  emit('update:modelValue', false);
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="props.modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background: rgba(10,10,10,0.5); backdrop-filter: blur(4px)"
        @click.self="close"
      >
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="props.modelValue"
            class="bg-white rounded-[16px] w-full shadow-xl overflow-hidden"
            :style="{ maxWidth: props.maxWidth }"
          >
            <div
              v-if="props.title"
              class="px-6 py-5 border-b border-[#e4e3dc] flex items-center justify-between"
            >
              <h3 class="font-['Unbounded'] text-[15px] font-semibold text-[#0a0a0a] tracking-tight">
                {{ props.title }}
              </h3>
              <button
                class="w-7 h-7 flex items-center justify-center rounded-[6px] text-[#8a8a82] hover:bg-[#f0efe9] hover:text-[#0a0a0a] transition-colors cursor-pointer"
                @click="close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="p-6">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
