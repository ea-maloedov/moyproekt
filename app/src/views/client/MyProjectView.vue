<script setup lang="ts">
import { computed } from 'vue';
import { projects } from '@/stores/app';
import { agencySettings } from '@/stores/app';
import Badge from '@/components/ui/badge.vue';
import { Check, Clock, Circle } from 'lucide-vue-next';

const project = computed(() => projects[0]!);

const progress = computed(() => {
  const done = project.value.stages.filter((s) => s.status === 'done').length;
  return Math.round((done / project.value.stages.length) * 100);
});

const currentStage = computed(() => project.value.stages.find((s) => s.status === 'active'));

function stageIcon(status: string) {
  if (status === 'done') return Check;
  if (status === 'active') return Clock;
  return Circle;
}
</script>

<template>
  <div class="p-6 max-w-[720px] mx-auto">
    <div class="mb-8">
      <p class="text-xs font-medium text-[#8a8a82] uppercase tracking-widest mb-2">Ваш проект</p>
      <h1 class="font-['Unbounded'] text-[22px] font-semibold text-[#0a0a0a] tracking-tight leading-tight">
        {{ project.name }}
      </h1>
      <p class="text-sm text-[#8a8a82] mt-1">Начат {{ project.startDate }}</p>
    </div>

    <!-- Progress card -->
    <div class="bg-white border border-[#e4e3dc] rounded-[16px] p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-sm font-medium text-[#0a0a0a]">Общий прогресс</p>
          <p v-if="currentStage" class="text-xs text-[#8a8a82] mt-0.5">
            Сейчас: <span class="font-medium text-[#0a0a0a]">{{ currentStage.name }}</span>
          </p>
          <p v-else class="text-xs text-emerald-600 mt-0.5 font-medium">Проект завершён!</p>
        </div>
        <span class="font-['Unbounded'] text-[32px] font-semibold text-[#0a0a0a] leading-none">
          {{ progress }}%
        </span>
      </div>
      <div class="h-2.5 bg-[#f0efe9] rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          :style="{ width: `${progress}%`, backgroundColor: agencySettings.primaryColor }"
        />
      </div>
      <!-- Stage dots -->
      <div class="flex items-center gap-1 mt-3">
        <div
          v-for="stage in project.stages"
          :key="stage.id"
          class="flex-1 h-1 rounded-full transition-all"
          :style="
            stage.status === 'done'
              ? { backgroundColor: '#0a0a0a' }
              : stage.status === 'active'
                ? { backgroundColor: agencySettings.primaryColor }
                : { backgroundColor: '#e4e3dc' }
          "
        />
      </div>
    </div>

    <!-- Stages -->
    <div class="flex flex-col gap-3">
      <h2 class="text-sm font-semibold text-[#0a0a0a]">Этапы проекта</h2>

      <div
        v-for="(stage, idx) in project.stages"
        :key="stage.id"
        class="bg-white border rounded-[12px] p-5 flex items-start gap-4 transition-all"
        :class="stage.status === 'active' ? 'border-[#2563ff]/30 shadow-sm' : 'border-[#e4e3dc]'"
      >
        <div class="flex flex-col items-center gap-1 shrink-0">
          <div
            class="w-9 h-9 rounded-full flex items-center justify-center"
            :class="
              stage.status === 'done'
                ? 'bg-[#0a0a0a] text-white'
                : 'text-white'
            "
            :style="
              stage.status === 'active'
                ? { backgroundColor: agencySettings.primaryColor }
                : stage.status === 'pending'
                  ? { backgroundColor: '#f0efe9', color: '#8a8a82' }
                  : {}
            "
          >
            <component :is="stageIcon(stage.status)" class="w-4 h-4" />
          </div>
          <div v-if="idx < project.stages.length - 1" class="w-px h-4 bg-[#e4e3dc]" />
        </div>

        <div class="flex-1 pt-0.5">
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <p class="text-sm font-semibold text-[#0a0a0a]">{{ stage.name }}</p>
            <Badge
              :variant="
                stage.status === 'done' ? 'default' : stage.status === 'active' ? 'accent' : 'outline'
              "
            >
              {{ stage.status === 'done' ? 'Завершён' : stage.status === 'active' ? 'В работе' : 'Ожидает' }}
            </Badge>
          </div>

          <p v-if="stage.description" class="text-sm text-[#8a8a82] mt-1.5 leading-relaxed">
            {{ stage.description }}
          </p>

          <p v-if="stage.completedAt" class="text-xs text-[#8a8a82] mt-2">
            ✓ Завершён {{ stage.completedAt }}
          </p>

          <div
            v-if="stage.status === 'active'"
            class="mt-3 flex items-center gap-2 text-xs font-medium"
            :style="{ color: agencySettings.primaryColor }"
          >
            <div
              class="w-1.5 h-1.5 rounded-full animate-pulse"
              :style="{ backgroundColor: agencySettings.primaryColor }"
            />
            Ведётся работа
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
