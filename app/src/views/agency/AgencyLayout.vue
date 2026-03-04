<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { agencySettings } from '@/stores/app';
import {
  LayoutGrid,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
} from 'lucide-vue-next';

const route = useRoute();
const { user, logout } = useAuth();

const navItems = [
  { path: '/agency/projects', icon: LayoutGrid, label: 'Проекты' },
  { path: '/agency/clients', icon: Users, label: 'Клиенты' },
  { path: '/agency/settings', icon: Settings, label: 'Настройки' },
];

const currentLabel = computed(() => {
  return navItems.find((n) => route.path.startsWith(n.path))?.label ?? 'МойПроект';
});

function isActive(path: string) {
  return route.path.startsWith(path);
}
</script>

<template>
  <div class="flex h-screen bg-[#fafaf8] overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-[220px] shrink-0 border-r border-[#e4e3dc] bg-white flex flex-col">
      <!-- Logo -->
      <div class="px-6 py-5 border-b border-[#e4e3dc]">
        <div class="font-['Unbounded'] text-[16px] leading-none tracking-[-0.04em]">
          <div class="font-light text-[#0a0a0a]">Мой</div>
          <div class="font-semibold text-[#2563ff]">Проект</div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <div
            class="w-2 h-2 rounded-full shrink-0"
            :style="{ backgroundColor: agencySettings.primaryColor }"
          />
          <span class="text-xs text-[#8a8a82] truncate">{{ agencySettings.name }}</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-4 flex flex-col gap-1">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-sm transition-colors"
          :class="
            isActive(item.path)
              ? 'bg-[#f0efe9] text-[#0a0a0a] font-medium'
              : 'text-[#8a8a82] hover:bg-[#f0efe9] hover:text-[#0a0a0a]'
          "
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
          <ChevronRight v-if="isActive(item.path)" class="w-3 h-3 ml-auto text-[#8a8a82]" />
        </router-link>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-[#e4e3dc]">
        <div class="flex items-center gap-3 px-3 py-2 rounded-[8px]">
          <div class="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {{ user?.name?.charAt(0) ?? 'U' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-[#0a0a0a] truncate">{{ user?.name }}</p>
            <p class="text-xs text-[#8a8a82] truncate">{{ user?.email }}</p>
          </div>
          <button
            class="text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            title="Выйти"
            @click="logout(); $router.push('/auth/login')"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Topbar -->
      <header class="h-14 border-b border-[#e4e3dc] bg-white flex items-center justify-between px-6 shrink-0">
        <h1 class="text-sm font-semibold text-[#0a0a0a]">{{ currentLabel }}</h1>
        <button class="w-8 h-8 rounded-full flex items-center justify-center text-[#8a8a82] hover:bg-[#f0efe9] hover:text-[#0a0a0a] transition-colors cursor-pointer relative">
          <Bell class="w-4 h-4" />
          <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#2563ff] rounded-full" />
        </button>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
