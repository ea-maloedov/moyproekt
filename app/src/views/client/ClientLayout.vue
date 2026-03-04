<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { agencySettings, projects } from '@/stores/app';
import { LayoutGrid, MessageSquare, FileText, LogOut } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { user, logout } = useAuth();

const project = computed(() => projects[0]!);

const navItems = [
  { path: '/client/project', icon: LayoutGrid, label: 'Мой проект' },
  { path: '/client/comments', icon: MessageSquare, label: 'Комментарии' },
  { path: '/client/documents', icon: FileText, label: 'Документы' },
];

function isActive(path: string) {
  return route.path === path;
}

function doLogout() {
  logout();
  router.push('/auth/login');
}
</script>

<template>
  <div class="flex h-screen bg-[#fafaf8] overflow-hidden">
    <aside class="w-[220px] shrink-0 border-r border-[#e4e3dc] bg-white flex flex-col">
      <!-- Agency brand — reflects live settings -->
      <div
        class="px-5 py-5 border-b border-black/10"
        :style="{ backgroundColor: agencySettings.primaryColor }"
      >
        <div class="flex items-center gap-2 mb-2">
          <img
            v-if="agencySettings.logo"
            :src="agencySettings.logo"
            class="w-7 h-7 rounded object-contain bg-white/20 p-0.5 shrink-0"
          />
          <div v-else class="w-7 h-7 rounded bg-white/20 shrink-0" />
        </div>
        <p
          class="text-white font-semibold tracking-tight leading-tight"
          :style="{ fontFamily: agencySettings.font, fontSize: '15px' }"
        >
          {{ agencySettings.name }}
        </p>
        <p v-if="agencySettings.tagline" class="text-white/60 text-xs mt-0.5 leading-tight">
          {{ agencySettings.tagline }}
        </p>
      </div>

      <!-- Project info -->
      <div class="px-5 py-4 border-b border-[#e4e3dc]">
        <p class="text-xs text-[#8a8a82] mb-1">Ваш проект</p>
        <p class="text-sm font-medium text-[#0a0a0a] leading-tight">{{ project.name }}</p>
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
        </router-link>
      </nav>

      <!-- User -->
      <div class="px-3 py-4 border-t border-[#e4e3dc]">
        <div class="flex items-center gap-3 px-3 py-2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
            :style="{ backgroundColor: agencySettings.primaryColor }"
          >
            {{ user?.name?.charAt(0) ?? 'К' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-[#0a0a0a] truncate">{{ user?.name }}</p>
            <p class="text-xs text-[#8a8a82] truncate">{{ user?.email }}</p>
          </div>
          <button
            class="text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer"
            @click="doLogout"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
