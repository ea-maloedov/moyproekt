<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { projects, clients, addProject, makeDefaultStages } from '@/stores/app';
import Button from '@/components/ui/button.vue';
import Badge from '@/components/ui/badge.vue';
import Modal from '@/components/ui/modal.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import { Plus, Search, ExternalLink } from 'lucide-vue-next';

const router = useRouter();
const search = ref('');
const showModal = ref(false);
const saving = ref(false);

const filtered = computed(() =>
  projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.client.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

const statusMap = {
  active: { label: 'Активный', variant: 'accent' as const },
  completed: { label: 'Завершён', variant: 'success' as const },
  paused: { label: 'Приостановлен', variant: 'warning' as const },
};

function currentStage(project: (typeof projects)[0]) {
  return project.stages.find((s) => s.status === 'active')?.name ?? project.stages.at(-1)?.name ?? '—';
}

function progress(project: (typeof projects)[0]) {
  const done = project.stages.filter((s) => s.status === 'done').length;
  return Math.round((done / project.stages.length) * 100);
}

// ── Create project form ──
const form = ref({
  name: '',
  clientId: '',
  budget: '',
});
const formErrors = ref<Record<string, string>>({});

function validateForm() {
  formErrors.value = {};
  if (!form.value.name.trim()) formErrors.value.name = 'Введите название';
  if (!form.value.clientId) formErrors.value.clientId = 'Выберите клиента';
  return Object.keys(formErrors.value).length === 0;
}

async function createProject() {
  if (!validateForm()) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 500));

  const selectedClient = clients.find((c) => c.id === form.value.clientId);
  if (!selectedClient) return;

  addProject({
    id: `p${Date.now()}`,
    name: form.value.name.trim(),
    client: selectedClient.name,
    clientEmail: selectedClient.email,
    status: 'active',
    startDate: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    budget: Number(form.value.budget) || 0,
    stages: makeDefaultStages(),
    comments: [],
    documents: [],
  });

  // Update client projects count
  const clientRecord = clients.find((c) => c.id === form.value.clientId);
  if (clientRecord) clientRecord.projectsCount++;

  form.value = { name: '', clientId: '', budget: '' };
  saving.value = false;
  showModal.value = false;
}
</script>

<template>
  <div class="p-6 max-w-[1100px] mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-['Unbounded'] text-[20px] font-semibold text-[#0a0a0a] tracking-tight">Проекты</h2>
        <p class="text-sm text-[#8a8a82] mt-0.5">{{ projects.length }} проектов</p>
      </div>
      <Button @click="showModal = true">
        <Plus class="w-4 h-4" />
        Новый проект
      </Button>
    </div>

    <!-- Search -->
    <div class="relative mb-5">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a82]" />
      <input
        v-model="search"
        placeholder="Поиск по проектам и клиентам..."
        class="w-full h-10 pl-9 pr-4 rounded-[8px] border border-[#e4e3dc] bg-white text-sm text-[#0a0a0a] placeholder:text-[#8a8a82] focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent transition-all"
      />
    </div>

    <!-- Table -->
    <div class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
      <div class="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px_40px] items-center px-5 py-3 border-b border-[#e4e3dc] bg-[#f0efe9]">
        <span class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Проект</span>
        <span class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Клиент</span>
        <span class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Этап</span>
        <span class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Статус</span>
        <span class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Прогресс</span>
        <span />
      </div>

      <div
        v-for="(project, idx) in filtered"
        :key="project.id"
        class="grid grid-cols-[2fr_1.5fr_1fr_1fr_120px_40px] items-center px-5 py-4 cursor-pointer hover:bg-[#fafaf8] transition-colors"
        :class="idx < filtered.length - 1 ? 'border-b border-[#e4e3dc]' : ''"
        @click="router.push(`/agency/projects/${project.id}`)"
      >
        <div>
          <p class="text-sm font-medium text-[#0a0a0a]">{{ project.name }}</p>
          <p class="text-xs text-[#8a8a82] mt-0.5">с {{ project.startDate }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-[#f0efe9] flex items-center justify-center text-xs font-semibold text-[#0a0a0a] shrink-0">
            {{ project.client.charAt(0) }}
          </div>
          <span class="text-sm text-[#0a0a0a] truncate">{{ project.client }}</span>
        </div>
        <span class="text-sm text-[#8a8a82]">{{ currentStage(project) }}</span>
        <Badge :variant="statusMap[project.status].variant">
          {{ statusMap[project.status].label }}
        </Badge>
        <div class="flex items-center gap-2">
          <div class="flex-1 h-1.5 bg-[#f0efe9] rounded-full overflow-hidden">
            <div class="h-full bg-[#0a0a0a] rounded-full transition-all" :style="{ width: `${progress(project)}%` }" />
          </div>
          <span class="text-xs text-[#8a8a82] w-8 text-right">{{ progress(project) }}%</span>
        </div>
        <div class="flex justify-end">
          <ExternalLink class="w-4 h-4 text-[#8a8a82]" />
        </div>
      </div>

      <div v-if="filtered.length === 0" class="py-16 text-center">
        <p class="text-[#8a8a82] text-sm">
          {{ search ? 'Ничего не найдено' : 'Проектов пока нет' }}
        </p>
        <Button v-if="!search" class="mt-4" @click="showModal = true">
          <Plus class="w-4 h-4" />
          Создать первый проект
        </Button>
      </div>
    </div>
  </div>

  <!-- Create project modal -->
  <Modal v-model="showModal" title="Новый проект">
    <form class="flex flex-col gap-4" @submit.prevent="createProject">
      <div class="flex flex-col gap-1.5">
        <Label for="pName">Название проекта</Label>
        <Input id="pName" v-model="form.name" placeholder="Корпоративный сайт" autofocus />
        <span v-if="formErrors.name" class="text-xs text-red-500">{{ formErrors.name }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="pClient">Клиент</Label>
        <select
          id="pClient"
          v-model="form.clientId"
          class="h-10 w-full rounded-[8px] border border-[#e4e3dc] bg-white px-3 text-sm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent"
        >
          <option value="" disabled>Выберите клиента</option>
          <option v-for="c in clients" :key="c.id" :value="c.id">
            {{ c.name }} — {{ c.company }}
          </option>
        </select>
        <span v-if="formErrors.clientId" class="text-xs text-red-500">{{ formErrors.clientId }}</span>
      </div>

      <div class="flex flex-col gap-1.5">
        <Label for="pBudget">Бюджет (₽)</Label>
        <Input id="pBudget" v-model="form.budget" type="number" placeholder="150000" />
      </div>

      <div class="bg-[#f0efe9] rounded-[8px] p-3 text-xs text-[#8a8a82]">
        Проект будет создан со стандартными этапами: Бриф → Дизайн → Разработка → Тестирование → Сдача
      </div>

      <div class="flex gap-3 justify-end pt-1">
        <Button variant="outline" type="button" @click="showModal = false">Отмена</Button>
        <Button type="submit" :disabled="saving">
          {{ saving ? 'Создаём...' : 'Создать проект' }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
