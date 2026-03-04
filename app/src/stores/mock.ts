export type StageStatus = 'done' | 'active' | 'pending';

export interface Stage {
  id: string;
  name: string;
  status: StageStatus;
  description: string;
  completedAt?: string;
}

export interface Comment {
  id: string;
  author: string;
  role: 'agency' | 'client';
  text: string;
  createdAt: string;
  attachment?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'act' | 'invoice' | 'contract';
  size: string;
  createdAt: string;
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  amount?: number;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  clientEmail: string;
  status: 'active' | 'completed' | 'paused';
  stages: Stage[];
  comments: Comment[];
  documents: Document[];
  startDate: string;
  budget: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  projectsCount: number;
  status: 'active' | 'inactive';
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor: string;
  domain?: string;
  plan: 'start' | 'agency' | 'team';
}

// ── MOCK DATA ──

export const mockAgency: Agency = {
  id: 'ag1',
  name: 'WebStudio Pro',
  slug: 'webstudio-pro',
  primaryColor: '#2563ff',
  domain: 'portal.webstudio.ru',
  plan: 'agency',
};

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Алексей Смирнов',
    email: 'alexey@romashka.ru',
    phone: '+7 905 123-45-67',
    company: 'Ромашка ООО',
    projectsCount: 2,
    status: 'active',
  },
  {
    id: 'c2',
    name: 'Мария Козлова',
    email: 'masha@techcorp.ru',
    phone: '+7 916 234-56-78',
    company: 'ТехКорп',
    projectsCount: 1,
    status: 'active',
  },
  {
    id: 'c3',
    name: 'Дмитрий Орлов',
    email: 'dmitry@cafe.ru',
    phone: '+7 926 345-67-89',
    company: 'Кафе Парус',
    projectsCount: 1,
    status: 'inactive',
  },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Корпоративный сайт Ромашка',
    client: 'Алексей Смирнов',
    clientEmail: 'alexey@romashka.ru',
    status: 'active',
    startDate: '01.02.2025',
    budget: 180000,
    stages: [
      { id: 's1', name: 'Бриф', status: 'done', description: 'Заполнение технического задания и брифа.', completedAt: '05.02.2025' },
      { id: 's2', name: 'Дизайн', status: 'done', description: 'Разработка UI/UX дизайна всех страниц.', completedAt: '20.02.2025' },
      { id: 's3', name: 'Разработка', status: 'active', description: 'Верстка и программирование сайта.' },
      { id: 's4', name: 'Тестирование', status: 'pending', description: 'Кроссбраузерное тестирование и QA.' },
      { id: 's5', name: 'Сдача', status: 'pending', description: 'Деплой, обучение, передача исходников.' },
    ],
    comments: [
      { id: 'cm1', author: 'Иван (менеджер)', role: 'agency', text: 'Привет! Мы начали работу над разработкой. Уже сверстали главную страницу — посмотрите в Figma по ссылке.', createdAt: '01.03.2025 10:30' },
      { id: 'cm2', author: 'Алексей', role: 'client', text: 'Отлично выглядит! Только хочу попросить поменять цвет кнопок на более тёмный синий.', createdAt: '01.03.2025 14:15' },
      { id: 'cm3', author: 'Иван (менеджер)', role: 'agency', text: 'Принято, исправим до завтра. Заодно оптимизируем мобильную версию.', createdAt: '01.03.2025 15:00' },
    ],
    documents: [
      { id: 'd1', name: 'Договор_Ромашка.pdf', type: 'contract', size: '234 КБ', createdAt: '01.02.2025' },
      { id: 'd2', name: 'Счёт_Аванс_50%.pdf', type: 'invoice', size: '89 КБ', createdAt: '01.02.2025', paymentStatus: 'paid', amount: 90000 },
      { id: 'd3', name: 'Счёт_Итоговый.pdf', type: 'invoice', size: '91 КБ', createdAt: '01.03.2025', paymentStatus: 'pending', amount: 90000 },
    ],
  },
  {
    id: 'p2',
    name: 'Интернет-магазин ТехКорп',
    client: 'Мария Козлова',
    clientEmail: 'masha@techcorp.ru',
    status: 'active',
    startDate: '15.02.2025',
    budget: 320000,
    stages: [
      { id: 's1', name: 'Бриф', status: 'done', description: 'Заполнение технического задания.', completedAt: '18.02.2025' },
      { id: 's2', name: 'Дизайн', status: 'active', description: 'Разработка UI/UX дизайна.' },
      { id: 's3', name: 'Разработка', status: 'pending', description: 'Программирование.' },
      { id: 's4', name: 'Тестирование', status: 'pending', description: 'QA.' },
      { id: 's5', name: 'Сдача', status: 'pending', description: 'Деплой и передача.' },
    ],
    comments: [],
    documents: [
      { id: 'd1', name: 'Договор_ТехКорп.pdf', type: 'contract', size: '251 КБ', createdAt: '15.02.2025' },
      { id: 'd2', name: 'Счёт_Аванс.pdf', type: 'invoice', size: '88 КБ', createdAt: '15.02.2025', paymentStatus: 'paid', amount: 160000 },
    ],
  },
  {
    id: 'p3',
    name: 'Сайт-визитка Кафе Парус',
    client: 'Дмитрий Орлов',
    clientEmail: 'dmitry@cafe.ru',
    status: 'completed',
    startDate: '01.12.2024',
    budget: 60000,
    stages: [
      { id: 's1', name: 'Бриф', status: 'done', description: '', completedAt: '03.12.2024' },
      { id: 's2', name: 'Дизайн', status: 'done', description: '', completedAt: '12.12.2024' },
      { id: 's3', name: 'Разработка', status: 'done', description: '', completedAt: '24.12.2024' },
      { id: 's4', name: 'Тестирование', status: 'done', description: '', completedAt: '27.12.2024' },
      { id: 's5', name: 'Сдача', status: 'done', description: '', completedAt: '30.12.2024' },
    ],
    comments: [],
    documents: [],
  },
];
