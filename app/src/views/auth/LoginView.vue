<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';

const router = useRouter();
const { loginAsAgency, loginAsClient, onboardingDone } = useAuth();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

async function handleLogin() {
  if (!email.value || !password.value) {
    error.value = 'Заполните все поля';
    return;
  }
  loading.value = true;
  error.value = '';

  await new Promise((r) => setTimeout(r, 600));

  // Mock: если @client — клиент, иначе агентство
  if (email.value.includes('client')) {
    loginAsClient();
    onboardingDone.value = true;
    router.push('/client/project');
  } else {
    loginAsAgency();
    onboardingDone.value = true;
    router.push('/agency/projects');
  }
  loading.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-[#fafaf8] flex items-center justify-center px-4">
    <div class="w-full max-w-[400px]">
      <!-- Logo -->
      <div class="text-center mb-10">
        <a href="/" class="inline-block">
          <div
            class="font-['Unbounded'] text-[22px] leading-none tracking-[-0.04em] flex flex-col items-center"
          >
            <span class="font-light text-[#0a0a0a]">Мой</span>
            <span class="font-semibold text-[#2563ff]">Проект</span>
          </div>
        </a>
        <p class="mt-4 text-sm text-[#8a8a82]">Войдите в аккаунт</p>
      </div>

      <!-- Form card -->
      <div class="bg-white border border-[#e4e3dc] rounded-[12px] p-8">
        <form @submit.prevent="handleLogin" class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="ivan@webstudio.ru"
              :disabled="loading"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <Label for="password">Пароль</Label>
              <a href="#" class="text-xs text-[#2563ff] hover:underline">Забыли пароль?</a>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="text-sm text-red-500 bg-red-50 rounded-[8px] px-3 py-2">
            {{ error }}
          </div>

          <Button type="submit" :disabled="loading" class="w-full mt-1" size="lg">
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Входим...
            </span>
            <span v-else>Войти</span>
          </Button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-[#e4e3dc]" />
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="bg-white px-3 text-[#8a8a82]">или войдите как</span>
          </div>
        </div>

        <!-- Mock login shortcuts -->
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="text-xs border border-[#e4e3dc] rounded-[8px] px-3 py-2.5 text-[#8a8a82] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            @click="email = 'ivan@webstudio.ru'; password = 'demo'"
          >
            Demo: Агентство
          </button>
          <button
            type="button"
            class="text-xs border border-[#e4e3dc] rounded-[8px] px-3 py-2.5 text-[#8a8a82] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            @click="email = 'client@romashka.ru'; password = 'demo'"
          >
            Demo: Клиент
          </button>
        </div>
      </div>

      <!-- Register link -->
      <p class="text-center text-sm text-[#8a8a82] mt-6">
        Нет аккаунта?
        <router-link to="/auth/register" class="text-[#0a0a0a] font-medium hover:text-[#2563ff] transition-colors">
          Зарегистрировать агентство
        </router-link>
      </p>
    </div>
  </div>
</template>
