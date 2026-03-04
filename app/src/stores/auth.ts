import { ref, computed } from 'vue';

export type UserRole = 'agency' | 'client';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  agencyId: string;
}

const user = ref<User | null>(null);
const onboardingDone = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => user.value !== null);
  const isAgency = computed(() => user.value?.role === 'agency');
  const isClient = computed(() => user.value?.role === 'client');

  function loginAsAgency() {
    user.value = {
      id: 'u1',
      email: 'ivan@webstudio.ru',
      name: 'Иван Петров',
      role: 'agency',
      agencyId: 'ag1',
    };
  }

  function loginAsClient() {
    user.value = {
      id: 'u2',
      email: 'client@example.ru',
      name: 'Алексей Смирнов',
      role: 'client',
      agencyId: 'ag1',
    };
  }

  function logout() {
    user.value = null;
    onboardingDone.value = false;
  }

  return { user, isAuthenticated, isAgency, isClient, onboardingDone, loginAsAgency, loginAsClient, logout };
}
