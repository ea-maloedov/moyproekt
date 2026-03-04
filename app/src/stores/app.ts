import { reactive } from 'vue';
import { mockProjects, mockClients, type Project, type Client, type Comment, type Stage } from './mock';

// ── AGENCY SETTINGS ──

export const agencySettings = reactive({
  name: 'WebStudio Pro',
  slug: 'webstudio-pro',
  tagline: 'Профессиональная веб-разработка',
  logo: null as string | null,
  primaryColor: '#2563ff',
  font: 'Golos Text',
  domain: 'portal.webstudio.ru',
  plan: 'agency' as 'start' | 'agency' | 'team',
  domainStatus: 'unchecked' as 'unchecked' | 'checking' | 'verified' | 'error',
});

// ── NOTIFICATION SETTINGS ──

export const notifySettings = reactive({
  telegramEnabled: false,
  telegramChatId: '',
  emailEnabled: true,
  onComment: true,
  onStageChange: true,
  onDocumentUpload: false,
});

// ── PROJECTS ──

export const projects = reactive<Project[]>(
  mockProjects.map((p) => ({ ...p, stages: p.stages.map((s) => ({ ...s })), comments: [...p.comments] })),
);

export function addProject(p: Project) {
  projects.unshift(p);
}

export function advanceStage(projectId: string, stageId: string) {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  const stage = project.stages.find((s) => s.id === stageId);
  if (!stage || stage.status === 'done') return;

  // Mark current as done
  stage.status = 'done';
  stage.completedAt = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // Activate next pending stage
  const idx = project.stages.indexOf(stage);
  const next = project.stages[idx + 1];
  if (next && next.status === 'pending') next.status = 'active';

  // If all done, mark project completed
  if (project.stages.every((s) => s.status === 'done')) {
    project.status = 'completed';
  }
}

export function addComment(projectId: string, text: string, authorName: string, role: 'agency' | 'client') {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  const comment: Comment = {
    id: `cm${Date.now()}`,
    author: authorName,
    role,
    text,
    createdAt: new Date()
      .toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(',', ''),
  };
  project.comments.push(comment);
}

// ── CLIENTS ──

export const clients = reactive<Client[]>([...mockClients]);

let clientCounter = mockClients.length + 1;
export function addClient(data: Omit<Client, 'id' | 'projectsCount' | 'status'>) {
  clients.push({ ...data, id: `c${clientCounter++}`, projectsCount: 0, status: 'active' });
}

// ── DEFAULT STAGE TEMPLATE ──

export function makeDefaultStages(): Stage[] {
  return [
    { id: 's1', name: 'Бриф', status: 'active', description: 'Заполнение технического задания и брифа.' },
    { id: 's2', name: 'Дизайн', status: 'pending', description: 'Разработка UI/UX дизайна всех страниц.' },
    { id: 's3', name: 'Разработка', status: 'pending', description: 'Верстка и программирование.' },
    { id: 's4', name: 'Тестирование', status: 'pending', description: 'QA и кроссбраузерное тестирование.' },
    { id: 's5', name: 'Сдача', status: 'pending', description: 'Деплой, обучение, передача исходников.' },
  ];
}
