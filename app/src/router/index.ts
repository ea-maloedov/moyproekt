import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth
    { path: '/', redirect: '/auth/login' },
    { path: '/auth/login', component: () => import('@/views/auth/LoginView.vue'), meta: { guest: true } },
    { path: '/auth/register', component: () => import('@/views/auth/RegisterView.vue'), meta: { guest: true } },

    // Onboarding
    { path: '/onboarding', component: () => import('@/views/OnboardingView.vue'), meta: { auth: true } },

    // Agency
    {
      path: '/agency',
      component: () => import('@/views/agency/AgencyLayout.vue'),
      meta: { auth: true, role: 'agency' },
      children: [
        { path: '', redirect: '/agency/projects' },
        { path: 'projects', component: () => import('@/views/agency/ProjectsView.vue') },
        { path: 'projects/:id', component: () => import('@/views/agency/ProjectDetailView.vue') },
        { path: 'clients', component: () => import('@/views/agency/ClientsView.vue') },
        { path: 'settings', component: () => import('@/views/agency/SettingsView.vue') },
      ],
    },

    // Client
    {
      path: '/client',
      component: () => import('@/views/client/ClientLayout.vue'),
      meta: { auth: true, role: 'client' },
      children: [
        { path: '', redirect: '/client/project' },
        { path: 'project', component: () => import('@/views/client/MyProjectView.vue') },
        { path: 'comments', component: () => import('@/views/client/CommentsView.vue') },
        { path: 'documents', component: () => import('@/views/client/DocumentsView.vue') },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const { isAuthenticated, user, onboardingDone } = useAuth();

  if (to.meta.auth && !isAuthenticated.value) {
    return '/auth/login';
  }

  if (to.meta.guest && isAuthenticated.value) {
    if (!onboardingDone.value) return '/onboarding';
    return user.value?.role === 'agency' ? '/agency/projects' : '/client/project';
  }

  if (to.meta.auth && isAuthenticated.value && !onboardingDone.value && to.path !== '/onboarding') {
    return '/onboarding';
  }

  return true;
});

export default router;
