<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';

const router = useRouter();
const { loginAsAgency } = useAuth();

const step = ref<1 | 2>(1);
const loading = ref(false);

// Step 1
const name = ref('');
const email = ref('');
const password = ref('');
const confirm = ref('');

// Step 2
const agencyName = ref('');

const errors = ref<Record<string, string>>({});

function validateStep1() {
  errors.value = {};
  if (!name.value) errors.value.name = 'Введите имя';
  if (!email.value) errors.value.email = 'Введите email';
  if (password.value.length < 8) errors.value.password = 'Минимум 8 символов';
  if (password.value !== confirm.value) errors.value.confirm = 'Пароли не совпадают';
  return Object.keys(errors.value).length === 0;
}

async function nextStep() {
  if (!validateStep1()) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 400));
  loading.value = false;
  step.value = 2;
}

async function handleRegister() {
  if (!agencyName.value) {
    errors.value = { agencyName: 'Введите название агентства' };
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 700));
  loginAsAgency();
  router.push('/onboarding');
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
    <div class="w-full max-w-[420px]">
      <!-- Logo -->
      <div class="text-center mb-10">
        <router-link to="/" class="inline-block">
          <div class="font-['Unbounded'] text-[22px] leading-none tracking-[-0.04em] flex flex-col items-center">
            <span class="font-light text-[#0a0a0a]">Мой</span>
            <span class="font-semibold text-[#2563ff]">Проект</span>
          </div>
        </router-link>
        <p class="mt-4 text-sm text-[#8a8a82]">Регистрация агентства</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center gap-2 mb-6">
        <div
          v-for="s in [1, 2]"
          :key="s"
          class="flex items-center gap-2 flex-1"
        >
          <div
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all shrink-0',
              step >= s ? 'bg-[#0a0a0a] text-[#fafaf8]' : 'bg-[#f0efe9] text-[#8a8a82]',
            ]"
          >
            <svg v-if="step > s" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span v-else>{{ s }}</span>
          </div>
          <span class="text-xs text-[#8a8a82]">{{ s === 1 ? 'Аккаунт' : 'Агентство' }}</span>
          <div v-if="s < 2" class="flex-1 h-px bg-[#e4e3dc]" />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white border border-[#e4e3dc] rounded-[12px] p-8">
        <!-- Step 1 -->
        <form v-if="step === 1" @submit.prevent="nextStep" class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <Label for="name">Ваше имя</Label>
            <Input id="name" v-model="name" placeholder="Иван Петров" :disabled="loading" />
            <span v-if="errors.name" class="text-xs text-red-500">{{ errors.name }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="ivan@webstudio.ru" :disabled="loading" />
            <span v-if="errors.email" class="text-xs text-red-500">{{ errors.email }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="password">Пароль</Label>
            <Input id="password" v-model="password" type="password" placeholder="Минимум 8 символов" :disabled="loading" />
            <span v-if="errors.password" class="text-xs text-red-500">{{ errors.password }}</span>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="confirm">Подтверждение пароля</Label>
            <Input id="confirm" v-model="confirm" type="password" placeholder="Повторите пароль" :disabled="loading" />
            <span v-if="errors.confirm" class="text-xs text-red-500">{{ errors.confirm }}</span>
          </div>

          <Button type="submit" :disabled="loading" class="w-full mt-1" size="lg">
            {{ loading ? 'Проверяем...' : 'Далее →' }}
          </Button>
        </form>

        <!-- Step 2 -->
        <form v-else @submit.prevent="handleRegister" class="flex flex-col gap-5">
          <div class="text-center mb-2">
            <p class="text-sm text-[#8a8a82]">Как называется ваше агентство?</p>
          </div>

          <div class="flex flex-col gap-1.5">
            <Label for="agencyName">Название агентства</Label>
            <Input
              id="agencyName"
              v-model="agencyName"
              placeholder="WebStudio Pro"
              :disabled="loading"
              class="text-base h-12"
            />
            <span v-if="errors.agencyName" class="text-xs text-red-500">{{ errors.agencyName }}</span>
            <p class="text-xs text-[#8a8a82]">Именно так это увидят ваши клиенты в портале</p>
          </div>

          <Button type="submit" :disabled="loading" class="w-full" size="lg">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Создаём аккаунт...
            </span>
            <span v-else>Создать аккаунт</span>
          </Button>

          <button
            type="button"
            class="text-sm text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            @click="step = 1"
          >
            ← Назад
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-[#8a8a82] mt-6">
        Уже есть аккаунт?
        <router-link to="/auth/login" class="text-[#0a0a0a] font-medium hover:text-[#2563ff] transition-colors">
          Войти
        </router-link>
      </p>

      <p class="text-center text-xs text-[#8a8a82] mt-4">
        Нажимая «Создать аккаунт», вы принимаете
        <a href="#" class="hover:underline">условия использования</a>
      </p>
    </div>
  </div>
</template>
