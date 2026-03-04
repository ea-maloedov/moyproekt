<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563ff] focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-[#0a0a0a] text-[#fafaf8] hover:bg-[#1a1a1a] hover:shadow-lg hover:-translate-y-px',
        outline: 'border border-[#e4e3dc] bg-transparent text-[#0a0a0a] hover:bg-[#f0efe9]',
        ghost: 'bg-transparent text-[#0a0a0a] hover:bg-[#f0efe9]',
        accent: 'bg-[#2563ff] text-white hover:bg-[#1d4ed8] hover:shadow-lg hover:-translate-y-px',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        link: 'text-[#2563ff] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface Props extends /* @vue-ignore */ HTMLAttributes {
  variant?: ButtonVariants['variant'];
  size?: ButtonVariants['size'];
  class?: string;
  as?: string;
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
});

const classes = computed(() => cn(buttonVariants({ variant: props.variant, size: props.size }), props.class));
</script>

<template>
  <component :is="as" :class="classes" v-bind="$attrs">
    <slot />
  </component>
</template>
