<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { mockAgency } from '@/stores/mock';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';

const router = useRouter();
const { onboardingDone } = useAuth();

const step = ref(1);
const loading = ref(false);

const agencyName = ref(mockAgency.name);
const primaryColor = ref(mockAgency.primaryColor);
const domain = ref('');

const COLORS = [
  { label: 'Синий', value: '#2563ff' },
  { label: 'Чёрный', value: '#0a0a0a' },
  { label: 'Фиолетовый', value: '#7c3aed' },
  { label: 'Изумруд', value: '#059669' },
  { label: 'Коралл', value: '#e55a4e' },
  { label: 'Янтарь', value: '#d97706' },
];

const steps = [
  { title: 'Добро пожаловать!', subtitle: 'Настройте портал за 3 минуты' },
  { title: 'Ваш бренд', subtitle: 'Клиенты увидят этот стиль' },
  { title: 'Свой домен', subtitle: 'Необязательно — можно пропустить' },
];

async function next() {
  if (step.value < 3) {
    step.value++;
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 800));
  onboardingDone.value = true;
  router.push('/agency/projects');
}

function skip() {
  onboardingDone.value = true;
  router.push('/agency/projects');
}
</script>

<template>
  <div class="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
    <div class="w-full max-w-[480px]">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="font-['Unbounded'] text-[22px] leading-none tracking-[-0.04em] flex flex-col items-center">
          <span class="font-light text-[#0a0a0a]">Мой</span>
          <span class="font-semibold text-[#2563ff]">Проект</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="flex gap-1.5 mb-8">
        <div
          v-for="i in 3"
          :key="i"
          class="h-1 flex-1 rounded-full transition-all duration-500"
          :class="step >= i ? 'bg-[#0a0a0a]' : 'bg-[#e4e3dc]'"
        />
      </div>

      <!-- Card -->
      <div class="bg-white border border-[#e4e3dc] rounded-[16px] p-8">
        <div class="mb-6">
          <p class="text-xs font-medium text-[#8a8a82] uppercase tracking-widest mb-1">
            Шаг {{ step }} из 3
          </p>
          <h1 class="font-['Unbounded'] text-[22px] font-semibold text-[#0a0a0a] tracking-tight leading-tight">
            {{ steps[step - 1]?.title }}
          </h1>
          <p class="text-sm text-[#8a8a82] mt-1">{{ steps[step - 1]?.subtitle }}</p>
        </div>

        <!-- Step 1: Welcome -->
        <div v-if="step === 1" class="flex flex-col gap-4">
          <div class="bg-[#f0efe9] rounded-[12px] p-5 flex flex-col gap-3">
            <div v-for="item in ['Добавьте ваших клиентов', 'Создайте первый проект', 'Пригласите клиента по ссылке']"
              :key="item"
              class="flex items-center gap-3"
            >
              <div class="w-5 h-5 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
                <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span class="text-sm text-[#0a0a0a]">{{ item }}</span>
            </div>
          </div>
          <div class="bg-[#eef2ff] border border-[#2563ff]/20 rounded-[12px] p-4">
            <p class="text-sm text-[#2563ff] font-medium">14 дней бесплатно</p>
            <p class="text-xs text-[#8a8a82] mt-0.5">Карта не нужна</p>
          </div>
        </div>

        <!-- Step 2: Brand -->
        <div v-else-if="step === 2" class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <Label for="agencyName">Название агентства</Label>
            <Input id="agencyName" v-model="agencyName" placeholder="WebStudio Pro" />
            <p class="text-xs text-[#8a8a82]">Отображается в хедере портала для клиентов</p>
          </div>

          <div class="flex flex-col gap-2">
            <Label>Основной цвет</Label>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="c in COLORS"
                :key="c.value"
                type="button"
                :title="c.label"
                class="h-9 w-full rounded-[8px] border-2 transition-all cursor-pointer"
                :style="{ backgroundColor: c.value }"
                :class="primaryColor === c.value ? 'border-[#0a0a0a] scale-110' : 'border-transparent hover:scale-105'"
                @click="primaryColor = c.value"
              />
            </div>
          </div>

          <!-- Preview -->
          <div class="border border-[#e4e3dc] rounded-[12px] overflow-hidden">
            <div
              class="px-4 py-3 flex items-center justify-between"
              :style="{ backgroundColor: primaryColor }"
            >
              <span class="text-white font-['Unbounded'] text-sm font-semibold tracking-tight">
                {{ agencyName || 'Ваше агентство' }}
              </span>
              <span class="text-white/70 text-xs">Портал</span>
            </div>
            <div class="p-4 bg-[#fafaf8]">
              <p class="text-xs text-[#8a8a82]">Предпросмотр шапки портала для клиентов</p>
            </div>
          </div>
        </div>

        <!-- Step 3: Domain -->
        <div v-else class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <Label for="domain">Свой домен</Label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8a8a82]">https://</span>
              <Input
                id="domain"
                v-model="domain"
                placeholder="portal.yoursite.ru"
                class="pl-16"
              />
            </div>
            <p class="text-xs text-[#8a8a82]">
              Направьте CNAME вашего домена на <code class="font-mono bg-[#f0efe9] px-1 rounded">portal.moyproekt.ru</code>
            </p>
          </div>

          <div class="bg-[#f0efe9] rounded-[12px] p-4 text-sm text-[#8a8a82]">
            <p class="font-medium text-[#0a0a0a] mb-1">По умолчанию</p>
            <p class="font-mono text-xs">
              portal.moyproekt.ru/<span class="text-[#2563ff]">webstudio-pro</span>
            </p>
            <p class="text-xs mt-1">Свой домен можно подключить позже в настройках</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-between mt-6">
        <button
          v-if="step === 3"
          type="button"
          class="text-sm text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          @click="skip"
        >
          Пропустить
        </button>
        <div v-else />

        <div class="flex items-center gap-3">
          <button
            v-if="step > 1"
            type="button"
            class="text-sm text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            @click="step--"
          >
            ← Назад
          </button>
          <Button :disabled="loading" size="lg" @click="next">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Настраиваем...
            </span>
            <span v-else>{{ step < 3 ? 'Далее →' : 'Начать работу' }}</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
