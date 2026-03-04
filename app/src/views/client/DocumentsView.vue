<script setup lang="ts">
import { computed } from 'vue';
import { projects } from '@/stores/app';
import { agencySettings } from '@/stores/app';
import Badge from '@/components/ui/badge.vue';
import { FileText, Download, CreditCard, Check } from 'lucide-vue-next';

const project = computed(() => projects[0]!);

const paymentMap = {
  paid: { label: 'Оплачен', variant: 'success' as const },
  pending: { label: 'Ожидает оплаты', variant: 'warning' as const },
  overdue: { label: 'Просрочен', variant: 'destructive' as const },
};

const pendingPayments = computed(() =>
  project.value.documents.filter((d) => d.paymentStatus === 'pending'),
);

const totalPending = computed(() =>
  pendingPayments.value.reduce((sum, d) => sum + (d.amount ?? 0), 0),
);
</script>

<template>
  <div class="p-6 max-w-[720px] mx-auto">
    <div class="mb-6">
      <h1 class="font-['Unbounded'] text-[20px] font-semibold text-[#0a0a0a] tracking-tight">
        Документы и оплата
      </h1>
      <p class="text-sm text-[#8a8a82] mt-0.5">{{ project.name }}</p>
    </div>

    <!-- Payment banner -->
    <div
      v-if="pendingPayments.length > 0"
      class="text-white rounded-[16px] p-6 mb-6 flex items-start justify-between gap-4"
      :style="{ backgroundColor: agencySettings.primaryColor }"
    >
      <div>
        <p class="text-xs text-white/60 uppercase tracking-widest mb-1">К оплате</p>
        <p class="font-['Unbounded'] text-[28px] font-semibold leading-none">
          {{ totalPending.toLocaleString('ru-RU') }} ₽
        </p>
        <p class="text-sm text-white/60 mt-2">
          {{ pendingPayments.length }} {{ pendingPayments.length === 1 ? 'счёт' : 'счёта' }} ожидают оплаты
        </p>
      </div>
      <button
        class="flex items-center gap-2 bg-white px-5 py-2.5 rounded-[8px] text-sm font-semibold shrink-0 cursor-pointer hover:bg-[#f0efe9] transition-colors"
        :style="{ color: agencySettings.primaryColor }"
      >
        <CreditCard class="w-4 h-4" />
        Оплатить через ЮKassa
      </button>
    </div>

    <div v-else class="bg-emerald-50 border border-emerald-200 rounded-[16px] p-5 mb-6 flex items-center gap-3">
      <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
        <Check class="w-4 h-4 text-white" />
      </div>
      <p class="text-sm text-emerald-700 font-medium">Все счета оплачены. Спасибо!</p>
    </div>

    <!-- Documents list -->
    <div class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold text-[#0a0a0a]">Все документы</h2>

      <div
        v-for="doc in project.documents"
        :key="doc.id"
        class="bg-white border border-[#e4e3dc] rounded-[12px] px-5 py-4 flex items-center gap-4"
      >
        <div class="w-11 h-11 rounded-[10px] bg-[#f0efe9] flex items-center justify-center shrink-0">
          <FileText class="w-5 h-5 text-[#8a8a82]" />
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-[#0a0a0a] truncate">{{ doc.name }}</p>
          <p class="text-xs text-[#8a8a82] mt-0.5">{{ doc.size }} · {{ doc.createdAt }}</p>
        </div>

        <div v-if="doc.paymentStatus" class="flex flex-col items-end gap-1">
          <span class="text-sm font-semibold text-[#0a0a0a]">
            {{ doc.amount?.toLocaleString('ru-RU') }} ₽
          </span>
          <Badge :variant="paymentMap[doc.paymentStatus].variant">
            {{ paymentMap[doc.paymentStatus].label }}
          </Badge>
        </div>

        <div class="flex items-center gap-2 pl-4 border-l border-[#e4e3dc]">
          <button
            class="p-1.5 rounded-[6px] text-[#8a8a82] hover:bg-[#f0efe9] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <Download class="w-4 h-4" />
          </button>
          <button
            v-if="doc.paymentStatus === 'pending'"
            class="text-sm font-semibold px-4 py-1.5 rounded-[6px] text-white cursor-pointer hover:opacity-90 transition-opacity"
            :style="{ backgroundColor: agencySettings.primaryColor }"
          >
            Оплатить
          </button>
        </div>
      </div>

      <div
        v-if="project.documents.length === 0"
        class="bg-white border border-[#e4e3dc] rounded-[12px] py-14 text-center text-sm text-[#8a8a82]"
      >
        Документов пока нет
      </div>
    </div>
  </div>
</template>
