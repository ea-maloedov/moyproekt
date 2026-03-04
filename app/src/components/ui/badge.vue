<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-[#0a0a0a] text-[#fafaf8]',
        secondary: 'bg-[#f0efe9] text-[#0a0a0a]',
        accent: 'bg-[#eef2ff] text-[#2563ff]',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700',
        destructive: 'bg-red-50 text-red-600',
        outline: 'border border-[#e4e3dc] text-[#8a8a82]',
      },
    },
    defaultVariants: { variant: 'secondary' },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

interface Props {
  class?: string;
  variant?: BadgeVariants['variant'];
}
const props = defineProps<Props>();
</script>

<template>
  <span :class="cn(badgeVariants({ variant: props.variant }), props.class)">
    <slot />
  </span>
</template>
