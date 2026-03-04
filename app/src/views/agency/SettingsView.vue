<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { agencySettings, notifySettings } from '@/stores/app';
import Button from '@/components/ui/button.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import Toggle from '@/components/ui/toggle.vue';
import {
  Check,
  Copy,
  Upload,
  Globe,
  Bell,
  Palette,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  CreditCard,
  LayoutGrid,
  MessageSquare,
  FileText,
  Trash2,
  Zap,
} from 'lucide-vue-next';

// ── Save state ──
const saving = ref(false);
const saved = ref(false);

async function save() {
  saving.value = true;
  await new Promise((r) => setTimeout(r, 500));
  saving.value = false;
  saved.value = true;
  setTimeout(() => (saved.value = false), 2500);
}

// ── Logo upload ──
const fileInput = ref<HTMLInputElement>();

function triggerUpload() {
  fileInput.value?.click();
}

function handleLogoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    agencySettings.logo = event.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  agencySettings.logo = null;
  if (fileInput.value) fileInput.value.value = '';
}

// ── Color picker ──
const COLOR_PRESETS = [
  { hex: '#2563ff', label: 'Синий' },
  { hex: '#0a0a0a', label: 'Чёрный' },
  { hex: '#7c3aed', label: 'Фиолетовый' },
  { hex: '#059669', label: 'Изумруд' },
  { hex: '#e55a4e', label: 'Коралл' },
  { hex: '#d97706', label: 'Янтарь' },
  { hex: '#0891b2', label: 'Циан' },
  { hex: '#be185d', label: 'Роза' },
];

const hexInput = ref(agencySettings.primaryColor);
watch(
  () => agencySettings.primaryColor,
  (v) => (hexInput.value = v),
);

function setColor(hex: string) {
  agencySettings.primaryColor = hex;
  hexInput.value = hex;
}

function onHexInput(val: string) {
  hexInput.value = val;
  const hex = val.startsWith('#') ? val : '#' + val;
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    agencySettings.primaryColor = hex;
  }
}

// ── Fonts ──
const FONTS = ['Golos Text', 'Inter', 'Manrope', 'Unbounded'];

// ── Domain ──
const dnsChecking = ref(false);

async function checkDns() {
  if (!agencySettings.domain) return;
  dnsChecking.value = true;
  agencySettings.domainStatus = 'checking';
  await new Promise((r) => setTimeout(r, 2200));
  // Simulate: verified if domain has at least one dot
  agencySettings.domainStatus = agencySettings.domain.split('.').length >= 2 ? 'verified' : 'error';
  dnsChecking.value = false;
}

// ── Telegram ──
const telegramTesting = ref(false);
const telegramTestStatus = ref<'idle' | 'success' | 'error'>('idle');

async function testTelegram() {
  if (!notifySettings.telegramChatId) return;
  telegramTesting.value = true;
  telegramTestStatus.value = 'idle';
  await new Promise((r) => setTimeout(r, 1500));
  // Simulate: success if chat ID looks like a group (-100...)
  telegramTestStatus.value = notifySettings.telegramChatId.startsWith('-') ? 'success' : 'error';
  telegramTesting.value = false;
  setTimeout(() => (telegramTestStatus.value = 'idle'), 4000);
}

// ── Invite link ──
const inviteLink = computed(
  () => `https://portal.moyproekt.ru/${agencySettings.slug}/invite/abc123xyz`,
);
const copied = ref(false);

function copyLink() {
  navigator.clipboard.writeText(inviteLink.value).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

// ── Plan ──
const PLANS = [
  {
    key: 'start',
    label: 'Старт',
    price: '1 990',
    period: '/мес',
    limit: 'до 5 проектов',
    features: ['5 проектов', '∞ клиентов', 'White-label портал', 'Свой логотип и цвет'],
    missing: ['Свой домен', 'Telegram-уведомления', 'API доступ'],
  },
  {
    key: 'agency',
    label: 'Агентство',
    price: '4 990',
    period: '/мес',
    limit: 'до 20 проектов',
    features: [
      '20 проектов',
      '∞ клиентов',
      'White-label портал',
      'Свой домен',
      'Telegram-уведомления',
      'Загрузка документов',
    ],
    missing: ['API доступ', 'Несколько брендов'],
    popular: true,
  },
  {
    key: 'team',
    label: 'Команда',
    price: '9 990',
    period: '/мес',
    limit: 'безлимит',
    features: [
      '∞ проектов',
      '∞ клиентов',
      'Несколько брендов',
      'API доступ',
      'Приоритетная поддержка',
      'White-label email',
    ],
    missing: [],
  },
];

const changingPlan = ref(false);

async function selectPlan(key: 'start' | 'agency' | 'team') {
  if (agencySettings.plan === key) return;
  changingPlan.value = true;
  await new Promise((r) => setTimeout(r, 600));
  agencySettings.plan = key;
  changingPlan.value = false;
}
</script>

<template>
  <div class="p-6 max-w-[1040px] mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h2 class="font-['Unbounded'] text-[20px] font-semibold text-[#0a0a0a] tracking-tight">Настройки</h2>
      <p class="text-sm text-[#8a8a82] mt-0.5">Конфигурация вашего white-label портала</p>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
      <!-- ══ LEFT: SETTINGS FORM ══ -->
      <div class="flex flex-col gap-5 min-w-0">

        <!-- ─ BRANDING ─ -->
        <section class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#e4e3dc] flex items-center gap-2.5">
            <Palette class="w-4 h-4 text-[#8a8a82]" />
            <h3 class="text-sm font-semibold text-[#0a0a0a]">Внешний вид</h3>
          </div>

          <div class="p-6 flex flex-col gap-6">
            <!-- Logo -->
            <div class="flex flex-col gap-2">
              <Label>Логотип</Label>
              <div
                v-if="!agencySettings.logo"
                class="border-2 border-dashed border-[#e4e3dc] rounded-[12px] p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-[#8a8a82] transition-colors"
                @click="triggerUpload"
              >
                <div class="w-12 h-12 rounded-full bg-[#f0efe9] flex items-center justify-center">
                  <Upload class="w-5 h-5 text-[#8a8a82]" />
                </div>
                <div class="text-center">
                  <p class="text-sm font-medium text-[#0a0a0a]">Загрузите логотип</p>
                  <p class="text-xs text-[#8a8a82] mt-0.5">PNG, SVG, WebP — до 2 МБ</p>
                </div>
                <Button variant="outline" size="sm" @click.stop="triggerUpload">Выбрать файл</Button>
              </div>
              <div v-else class="flex items-center gap-4 p-4 border border-[#e4e3dc] rounded-[12px]">
                <div class="w-16 h-16 rounded-[8px] border border-[#e4e3dc] bg-[#f0efe9] flex items-center justify-center overflow-hidden shrink-0">
                  <img :src="agencySettings.logo" class="w-full h-full object-contain p-1" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-[#0a0a0a]">Логотип загружен</p>
                  <p class="text-xs text-[#8a8a82]">Отображается в шапке портала</p>
                </div>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm" @click="triggerUpload">Заменить</Button>
                  <button
                    class="p-2 text-[#8a8a82] hover:text-red-500 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
                    @click="removeLogo"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input ref="fileInput" type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" class="hidden" @change="handleLogoUpload" />
            </div>

            <!-- Name + tagline -->
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <Label for="agName">Название агентства</Label>
                <Input id="agName" v-model="agencySettings.name" placeholder="WebStudio Pro" />
              </div>
              <div class="flex flex-col gap-1.5">
                <Label for="tagline">Слоган</Label>
                <Input id="tagline" v-model="agencySettings.tagline" placeholder="Профессиональная разработка" />
                <p class="text-xs text-[#8a8a82]">Отображается под названием в портале</p>
              </div>
            </div>

            <!-- Color picker -->
            <div class="flex flex-col gap-3">
              <Label>Основной цвет</Label>
              <div class="flex items-center gap-3 flex-wrap">
                <!-- Presets -->
                <div class="flex gap-2 flex-wrap">
                  <button
                    v-for="c in COLOR_PRESETS"
                    :key="c.hex"
                    :title="c.label"
                    type="button"
                    class="w-8 h-8 rounded-full border-2 transition-all cursor-pointer"
                    :style="{ backgroundColor: c.hex }"
                    :class="
                      agencySettings.primaryColor === c.hex
                        ? 'border-[#0a0a0a] scale-110 shadow-sm'
                        : 'border-white shadow-sm hover:scale-110'
                    "
                    @click="setColor(c.hex)"
                  />
                </div>

                <!-- Divider -->
                <div class="w-px h-6 bg-[#e4e3dc]" />

                <!-- Custom hex -->
                <div class="flex items-center gap-2">
                  <div
                    class="w-8 h-8 rounded-full border border-[#e4e3dc] shrink-0 transition-colors"
                    :style="{ backgroundColor: agencySettings.primaryColor }"
                  />
                  <div class="relative">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#8a8a82] font-mono">#</span>
                    <input
                      :value="hexInput.replace('#', '')"
                      maxlength="6"
                      placeholder="2563ff"
                      class="w-24 h-8 pl-6 pr-2 rounded-[6px] border border-[#e4e3dc] text-xs font-mono text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent"
                      @input="onHexInput(($event.target as HTMLInputElement).value)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Font -->
            <div class="flex flex-col gap-3">
              <Label>Шрифт портала</Label>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="font in FONTS"
                  :key="font"
                  type="button"
                  class="px-4 py-2 rounded-[8px] text-sm border transition-all cursor-pointer"
                  :class="
                    agencySettings.font === font
                      ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                      : 'bg-white text-[#0a0a0a] border-[#e4e3dc] hover:border-[#8a8a82]'
                  "
                  :style="{ fontFamily: font }"
                  @click="agencySettings.font = font"
                >
                  {{ font }}
                </button>
              </div>
              <!-- Font preview -->
              <div class="bg-[#f0efe9] rounded-[10px] p-4">
                <p
                  class="text-lg font-semibold text-[#0a0a0a]"
                  :style="{ fontFamily: agencySettings.font }"
                >
                  {{ agencySettings.name || 'WebStudio Pro' }}
                </p>
                <p
                  class="text-sm text-[#8a8a82] mt-0.5"
                  :style="{ fontFamily: agencySettings.font }"
                >
                  {{ agencySettings.tagline || 'Клиентский портал' }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- ─ DOMAIN ─ -->
        <section class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#e4e3dc] flex items-center gap-2.5">
            <Globe class="w-4 h-4 text-[#8a8a82]" />
            <h3 class="text-sm font-semibold text-[#0a0a0a]">Кастомный домен</h3>
            <span class="ml-auto text-xs bg-[#eef2ff] text-[#2563ff] px-2 py-0.5 rounded-full font-medium">
              Агентство+
            </span>
          </div>

          <div class="p-6 flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <Label for="domain">Ваш домен</Label>
              <div class="flex gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8a8a82]">https://</span>
                  <Input
                    id="domain"
                    v-model="agencySettings.domain"
                    placeholder="portal.yoursite.ru"
                    class="pl-16"
                    @input="agencySettings.domainStatus = 'unchecked'"
                  />
                </div>
                <Button
                  variant="outline"
                  :disabled="!agencySettings.domain || dnsChecking"
                  @click="checkDns"
                >
                  <Loader2 v-if="dnsChecking" class="w-4 h-4 animate-spin" />
                  <span v-else>Проверить DNS</span>
                </Button>
              </div>
            </div>

            <!-- DNS status -->
            <div
              v-if="agencySettings.domainStatus !== 'unchecked'"
              class="flex items-start gap-3 p-4 rounded-[10px]"
              :class="{
                'bg-[#f0efe9]': agencySettings.domainStatus === 'checking',
                'bg-emerald-50 border border-emerald-200': agencySettings.domainStatus === 'verified',
                'bg-red-50 border border-red-200': agencySettings.domainStatus === 'error',
              }"
            >
              <Loader2
                v-if="agencySettings.domainStatus === 'checking'"
                class="w-4 h-4 text-[#8a8a82] animate-spin mt-0.5 shrink-0"
              />
              <CheckCircle2
                v-else-if="agencySettings.domainStatus === 'verified'"
                class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0"
              />
              <AlertCircle
                v-else
                class="w-4 h-4 text-red-500 mt-0.5 shrink-0"
              />
              <div>
                <p
                  class="text-sm font-medium"
                  :class="{
                    'text-[#8a8a82]': agencySettings.domainStatus === 'checking',
                    'text-emerald-700': agencySettings.domainStatus === 'verified',
                    'text-red-600': agencySettings.domainStatus === 'error',
                  }"
                >
                  {{
                    agencySettings.domainStatus === 'checking'
                      ? 'Проверяем DNS запись...'
                      : agencySettings.domainStatus === 'verified'
                        ? 'Домен успешно подключён!'
                        : 'DNS запись не найдена'
                  }}
                </p>
                <p
                  v-if="agencySettings.domainStatus === 'error'"
                  class="text-xs text-red-500 mt-0.5"
                >
                  Убедитесь, что вы добавили CNAME запись и подождите до 24 часов
                </p>
              </div>
            </div>

            <!-- CNAME instructions -->
            <div class="bg-[#f0efe9] rounded-[10px] p-4">
              <p class="text-xs font-semibold text-[#0a0a0a] mb-3 uppercase tracking-wide">
                Инструкция
              </p>
              <div class="flex flex-col gap-2">
                <div class="flex items-start gap-2 text-xs">
                  <span class="w-5 h-5 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">1</span>
                  <p class="text-[#8a8a82]">Войдите в панель управления DNS вашего домена</p>
                </div>
                <div class="flex items-start gap-2 text-xs">
                  <span class="w-5 h-5 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">2</span>
                  <div class="text-[#8a8a82]">
                    Добавьте CNAME запись:
                    <div class="mt-1.5 bg-white border border-[#e4e3dc] rounded-[6px] px-3 py-2 font-mono text-[#0a0a0a] flex items-center justify-between gap-4">
                      <span>
                        <span class="text-[#8a8a82]">{{ agencySettings.domain.split('.')[0] || 'portal' }}</span>
                        <span class="text-[#8a8a82] mx-2">→</span>
                        <span class="text-[#2563ff]">portal.moyproekt.ru</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex items-start gap-2 text-xs">
                  <span class="w-5 h-5 rounded-full bg-[#0a0a0a] text-white flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5">3</span>
                  <p class="text-[#8a8a82]">Нажмите «Проверить DNS» — изменения применяются за 1–24 ч</p>
                </div>
              </div>
            </div>

            <!-- Default URL -->
            <div class="flex items-center justify-between py-3 px-4 bg-[#f0efe9] rounded-[10px]">
              <div>
                <p class="text-xs font-medium text-[#8a8a82] mb-0.5">Ссылка по умолчанию</p>
                <code class="text-sm font-mono text-[#0a0a0a]">
                  portal.moyproekt.ru/<span class="text-[#2563ff]">{{ agencySettings.slug }}</span>
                </code>
              </div>
              <p class="text-xs text-[#8a8a82]">Доступна всегда</p>
            </div>
          </div>
        </section>

        <!-- ─ NOTIFICATIONS ─ -->
        <section class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#e4e3dc] flex items-center gap-2.5">
            <Bell class="w-4 h-4 text-[#8a8a82]" />
            <h3 class="text-sm font-semibold text-[#0a0a0a]">Уведомления</h3>
          </div>

          <div class="p-6 flex flex-col gap-6">
            <!-- Telegram -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-[#0a0a0a]">Telegram</p>
                  <p class="text-xs text-[#8a8a82]">Уведомления в Telegram-канал или группу</p>
                </div>
                <Toggle v-model="notifySettings.telegramEnabled" />
              </div>

              <div v-if="notifySettings.telegramEnabled" class="flex flex-col gap-3 pl-0">
                <div class="flex flex-col gap-1.5">
                  <Label for="chatId">Chat ID</Label>
                  <div class="flex gap-2">
                    <Input
                      id="chatId"
                      v-model="notifySettings.telegramChatId"
                      placeholder="-1001234567890"
                      class="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="default"
                      :disabled="!notifySettings.telegramChatId || telegramTesting"
                      @click="testTelegram"
                    >
                      <Loader2 v-if="telegramTesting" class="w-4 h-4 animate-spin" />
                      <Send v-else class="w-4 h-4" />
                      Тест
                    </Button>
                  </div>
                  <p class="text-xs text-[#8a8a82]">
                    Добавьте бота <code class="bg-[#f0efe9] px-1 rounded font-mono">@moyproekt_bot</code> в группу/канал и дайте ему права на отправку сообщений
                  </p>
                  <div
                    v-if="telegramTestStatus !== 'idle'"
                    class="flex items-center gap-2 text-xs py-2 px-3 rounded-[6px]"
                    :class="telegramTestStatus === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'"
                  >
                    <CheckCircle2 v-if="telegramTestStatus === 'success'" class="w-3.5 h-3.5" />
                    <AlertCircle v-else class="w-3.5 h-3.5" />
                    {{
                      telegramTestStatus === 'success'
                        ? 'Тестовое сообщение отправлено!'
                        : 'Ошибка. Проверьте Chat ID — он должен начинаться с "-"'
                    }}
                  </div>
                </div>

                <!-- Events -->
                <div class="flex flex-col gap-2 pt-1">
                  <p class="text-xs font-medium text-[#8a8a82] uppercase tracking-wide">Отправлять когда</p>
                  <label
                    v-for="item in [
                      { key: 'onComment', label: 'Клиент оставил комментарий' },
                      { key: 'onStageChange', label: 'Завершён этап проекта' },
                      { key: 'onDocumentUpload', label: 'Загружен документ' },
                    ]"
                    :key="item.key"
                    class="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :checked="notifySettings[item.key as keyof typeof notifySettings] as boolean"
                      class="w-4 h-4 rounded border-[#e4e3dc] accent-[#0a0a0a] cursor-pointer"
                      @change="(e) => ((notifySettings as Record<string, unknown>)[item.key] = (e.target as HTMLInputElement).checked)"
                    />
                    <span class="text-sm text-[#0a0a0a]">{{ item.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="h-px bg-[#e4e3dc]" />

            <!-- Email -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-[#0a0a0a]">Email</p>
                <p class="text-xs text-[#8a8a82]">На {{ 'ivan@webstudio.ru' }}</p>
              </div>
              <Toggle v-model="notifySettings.emailEnabled" />
            </div>
          </div>
        </section>

        <!-- ─ INVITE ─ -->
        <section class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
          <div class="px-6 py-4 border-b border-[#e4e3dc] flex items-center gap-2.5">
            <Zap class="w-4 h-4 text-[#8a8a82]" />
            <h3 class="text-sm font-semibold text-[#0a0a0a]">Ссылка-приглашение</h3>
          </div>
          <div class="p-6">
            <p class="text-sm text-[#8a8a82] mb-4">
              Поделитесь ссылкой с клиентом — он автоматически получит доступ к своему проекту без регистрации.
            </p>
            <div class="flex gap-2">
              <input
                :value="inviteLink"
                readonly
                class="flex-1 h-10 px-3 rounded-[8px] border border-[#e4e3dc] bg-[#f0efe9] text-sm font-mono text-[#8a8a82] focus:outline-none"
              />
              <Button variant="outline" @click="copyLink">
                <Check v-if="copied" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4" />
                {{ copied ? 'Скопировано!' : 'Копировать' }}
              </Button>
            </div>
          </div>
        </section>

        <!-- Save -->
        <div class="flex justify-end py-2">
          <Button size="lg" :disabled="saving" @click="save">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <Check v-else-if="saved" class="w-4 h-4 text-emerald-400" />
            {{ saving ? 'Сохраняем...' : saved ? 'Сохранено!' : 'Сохранить изменения' }}
          </Button>
        </div>
      </div>

      <!-- ══ RIGHT: PREVIEW + PLAN ══ -->
      <div class="flex flex-col gap-5">
        <div class="sticky top-6 flex flex-col gap-5">

          <!-- Live portal preview -->
          <div class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
            <div class="px-4 py-3 border-b border-[#e4e3dc]">
              <p class="text-xs font-semibold text-[#0a0a0a] uppercase tracking-wide">Предпросмотр</p>
            </div>

            <!-- Browser chrome -->
            <div class="bg-[#f0efe9] px-3 py-2 flex items-center gap-2 border-b border-[#e4e3dc]">
              <div class="flex gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full bg-[#e4e3dc]" />
                <div class="w-2.5 h-2.5 rounded-full bg-[#e4e3dc]" />
                <div class="w-2.5 h-2.5 rounded-full bg-[#e4e3dc]" />
              </div>
              <div class="flex-1 bg-white rounded-[4px] px-2 py-1 text-[9px] text-[#8a8a82] font-mono truncate">
                {{ agencySettings.domain || `portal.moyproekt.ru/${agencySettings.slug}` }}
              </div>
            </div>

            <!-- App preview -->
            <div class="flex h-[230px] text-[10px]">
              <!-- Mini sidebar -->
              <div class="w-[110px] shrink-0 border-r border-[#e4e3dc] flex flex-col bg-white overflow-hidden">
                <!-- Brand header -->
                <div
                  class="p-2.5 border-b border-black/5"
                  :style="{ backgroundColor: agencySettings.primaryColor }"
                >
                  <div class="flex items-center gap-1.5 mb-1">
                    <img
                      v-if="agencySettings.logo"
                      :src="agencySettings.logo"
                      class="w-5 h-5 rounded object-contain bg-white/20 p-0.5"
                    />
                    <div
                      v-else
                      class="w-5 h-5 rounded bg-white/20"
                    />
                  </div>
                  <p
                    class="text-white font-semibold leading-tight truncate text-[11px]"
                    :style="{ fontFamily: agencySettings.font }"
                  >
                    {{ agencySettings.name || 'Агентство' }}
                  </p>
                  <p
                    v-if="agencySettings.tagline"
                    class="text-white/50 mt-0.5 truncate leading-tight text-[9px]"
                    :style="{ fontFamily: agencySettings.font }"
                  >
                    {{ agencySettings.tagline }}
                  </p>
                </div>

                <!-- Project name -->
                <div class="px-2.5 py-1.5 border-b border-[#e4e3dc]">
                  <p class="text-[#8a8a82] text-[9px] mb-0.5">Проект</p>
                  <p class="text-[#0a0a0a] font-medium leading-tight truncate">Корп. сайт</p>
                </div>

                <!-- Nav -->
                <div class="p-1.5 flex flex-col gap-0.5">
                  <div class="px-2 py-1.5 rounded-[4px] bg-[#f0efe9] text-[#0a0a0a] font-medium flex items-center gap-1.5">
                    <LayoutGrid class="w-2.5 h-2.5 shrink-0" />
                    Мой проект
                  </div>
                  <div class="px-2 py-1.5 text-[#8a8a82] flex items-center gap-1.5">
                    <MessageSquare class="w-2.5 h-2.5 shrink-0" />
                    Комментарии
                  </div>
                  <div class="px-2 py-1.5 text-[#8a8a82] flex items-center gap-1.5">
                    <FileText class="w-2.5 h-2.5 shrink-0" />
                    Документы
                  </div>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 bg-[#fafaf8] p-2.5 flex flex-col gap-2 overflow-hidden">
                <div class="h-2.5 bg-[#0a0a0a]/10 rounded-full w-3/4" />
                <div class="h-1.5 bg-[#0a0a0a]/5 rounded-full w-1/2 mb-1" />

                <!-- Stage items -->
                <div
                  v-for="(item, i) in [
                    { done: true, label: 'Бриф' },
                    { done: true, label: 'Дизайн' },
                    { active: true, label: 'Разработка' },
                    { done: false, label: 'Тестирование' },
                  ]"
                  :key="i"
                  class="bg-white border border-[#e4e3dc] rounded-[5px] px-2 py-1.5 flex items-center gap-1.5"
                >
                  <div
                    class="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-white"
                    :style="
                      item.done
                        ? { backgroundColor: '#0a0a0a' }
                        : item.active
                          ? { backgroundColor: agencySettings.primaryColor }
                          : { backgroundColor: '#f0efe9' }
                    "
                  >
                    <svg v-if="item.done" viewBox="0 0 24 24" class="w-2.5 h-2.5" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span class="flex-1 truncate text-[#0a0a0a]">{{ item.label }}</span>
                  <span
                    v-if="item.active"
                    class="text-[8px] px-1.5 py-0.5 rounded-full font-medium"
                    :style="{ backgroundColor: agencySettings.primaryColor + '22', color: agencySettings.primaryColor }"
                  >
                    В работе
                  </span>
                </div>
              </div>
            </div>

            <div class="px-4 py-2.5 border-t border-[#e4e3dc] bg-[#fafaf8]">
              <p class="text-[11px] text-[#8a8a82]">Так видит портал ваш клиент</p>
            </div>
          </div>

          <!-- Plan -->
          <div class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden">
            <div class="px-5 py-4 border-b border-[#e4e3dc] flex items-center gap-2.5">
              <CreditCard class="w-4 h-4 text-[#8a8a82]" />
              <h3 class="text-sm font-semibold text-[#0a0a0a]">Тариф</h3>
            </div>
            <div class="p-4 flex flex-col gap-3">
              <div
                v-for="plan in PLANS"
                :key="plan.key"
                class="border rounded-[10px] p-4 cursor-pointer transition-all relative"
                :class="
                  agencySettings.plan === plan.key
                    ? 'border-[#0a0a0a] bg-[#0a0a0a]'
                    : 'border-[#e4e3dc] hover:border-[#8a8a82]'
                "
                @click="selectPlan(plan.key as 'start' | 'agency' | 'team')"
              >
                <div v-if="plan.popular && agencySettings.plan !== plan.key" class="absolute -top-2 right-3 text-[10px] bg-[#eef2ff] text-[#2563ff] px-2 py-0.5 rounded-full font-semibold">
                  Популярный
                </div>
                <div class="flex items-start justify-between">
                  <div>
                    <p
                      class="text-sm font-semibold"
                      :class="agencySettings.plan === plan.key ? 'text-white' : 'text-[#0a0a0a]'"
                    >
                      {{ plan.label }}
                    </p>
                    <p
                      class="text-lg font-bold leading-tight mt-0.5"
                      :class="agencySettings.plan === plan.key ? 'text-white' : 'text-[#0a0a0a]'"
                    >
                      {{ plan.price }}
                      <span class="text-sm font-normal" :class="agencySettings.plan === plan.key ? 'text-white/60' : 'text-[#8a8a82]'">
                        {{ plan.period }}
                      </span>
                    </p>
                  </div>
                  <div
                    v-if="agencySettings.plan === plan.key"
                    class="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0"
                  >
                    <Check class="w-3 h-3 text-[#0a0a0a]" />
                  </div>
                </div>
                <p
                  class="text-xs mt-2"
                  :class="agencySettings.plan === plan.key ? 'text-white/50' : 'text-[#8a8a82]'"
                >
                  {{ plan.limit }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
