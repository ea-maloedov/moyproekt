<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projects, advanceStage, addComment } from '@/stores/app';
import { useAuth } from '@/stores/auth';
import Button from '@/components/ui/button.vue';
import Badge from '@/components/ui/badge.vue';
import Modal from '@/components/ui/modal.vue';
import {
  ArrowLeft,
  Check,
  Clock,
  Circle,
  Send,
  Paperclip,
  FileText,
  Download,
  Copy,
  Zap,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const { user } = useAuth();

const project = computed(() => projects.find((p) => p.id === route.params.id));
const activeTab = ref<'stages' | 'comments' | 'documents'>('stages');

const newComment = ref('');

function sendComment() {
  if (!newComment.value.trim() || !project.value) return;
  addComment(project.value.id, newComment.value.trim(), user.value?.name ?? 'Менеджер', 'agency');
  newComment.value = '';
}

function stageIconComp(status: string) {
  if (status === 'done') return Check;
  if (status === 'active') return Clock;
  return Circle;
}

function progress() {
  if (!project.value) return 0;
  const done = project.value.stages.filter((s) => s.status === 'done').length;
  return Math.round((done / project.value.stages.length) * 100);
}

const paymentMap = {
  paid: { label: 'Оплачен', variant: 'success' as const },
  pending: { label: 'Ожидает оплаты', variant: 'warning' as const },
  overdue: { label: 'Просрочен', variant: 'destructive' as const },
};

// Invite modal
const showInvite = ref(false);
const inviteLink = computed(
  () => `https://portal.moyproekt.ru/webstudio-pro/invite/${route.params.id}/abc123`,
);
const copiedInvite = ref(false);

function copyInvite() {
  navigator.clipboard.writeText(inviteLink.value).catch(() => {});
  copiedInvite.value = true;
  setTimeout(() => (copiedInvite.value = false), 2000);
}
</script>

<template>
  <div v-if="project" class="p-6 max-w-[900px] mx-auto">
    <!-- Back + header -->
    <div class="flex items-start justify-between mb-6">
      <div>
        <button
          class="flex items-center gap-1.5 text-sm text-[#8a8a82] hover:text-[#0a0a0a] transition-colors mb-3 cursor-pointer"
          @click="router.push('/agency/projects')"
        >
          <ArrowLeft class="w-4 h-4" />
          Все проекты
        </button>
        <h2 class="font-['Unbounded'] text-[20px] font-semibold text-[#0a0a0a] tracking-tight">
          {{ project.name }}
        </h2>
        <div class="flex items-center gap-3 mt-1 flex-wrap">
          <div class="flex items-center gap-1.5">
            <div class="w-5 h-5 rounded-full bg-[#f0efe9] flex items-center justify-center text-[10px] font-semibold text-[#0a0a0a]">
              {{ project.client.charAt(0) }}
            </div>
            <span class="text-sm text-[#8a8a82]">{{ project.client }}</span>
          </div>
          <span class="text-[#e4e3dc]">·</span>
          <span class="text-sm text-[#8a8a82]">с {{ project.startDate }}</span>
          <span v-if="project.budget" class="text-[#e4e3dc]">·</span>
          <span v-if="project.budget" class="text-sm font-medium text-[#0a0a0a]">
            {{ project.budget.toLocaleString('ru-RU') }} ₽
          </span>
        </div>
      </div>
      <Button variant="outline" size="sm" @click="showInvite = true">
        <Zap class="w-4 h-4" />
        Пригласить клиента
      </Button>
    </div>

    <!-- Progress -->
    <div class="bg-white border border-[#e4e3dc] rounded-[12px] p-5 mb-5">
      <div class="flex items-center justify-between mb-3">
        <div>
          <span class="text-sm font-medium text-[#0a0a0a]">Прогресс</span>
          <span class="ml-2 text-xs text-[#8a8a82]">
            {{ project.stages.filter((s) => s.status === 'done').length }} из {{ project.stages.length }} этапов
          </span>
        </div>
        <span class="text-sm font-bold text-[#0a0a0a]">{{ progress() }}%</span>
      </div>
      <div class="h-2 bg-[#f0efe9] rounded-full overflow-hidden">
        <div
          class="h-full bg-[#0a0a0a] rounded-full transition-all duration-700"
          :style="{ width: `${progress()}%` }"
        />
      </div>
      <!-- Stage mini-steps -->
      <div class="flex items-center gap-1 mt-3">
        <div
          v-for="stage in project.stages"
          :key="stage.id"
          class="flex-1 h-1 rounded-full transition-all"
          :class="
            stage.status === 'done'
              ? 'bg-[#0a0a0a]'
              : stage.status === 'active'
                ? 'bg-[#2563ff]'
                : 'bg-[#e4e3dc]'
          "
        />
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-white border border-[#e4e3dc] rounded-[12px] overflow-hidden mb-5">
      <div class="flex border-b border-[#e4e3dc]">
        <button
          v-for="tab in [
            { key: 'stages', label: 'Этапы' },
            { key: 'comments', label: `Комментарии (${project.comments.length})` },
            { key: 'documents', label: `Документы (${project.documents.length})` },
          ]"
          :key="tab.key"
          class="px-5 py-3.5 text-sm font-medium transition-colors cursor-pointer border-b-2 -mb-px"
          :class="
            activeTab === tab.key
              ? 'text-[#0a0a0a] border-[#0a0a0a]'
              : 'text-[#8a8a82] border-transparent hover:text-[#0a0a0a]'
          "
          @click="activeTab = tab.key as typeof activeTab"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Stages -->
      <div v-if="activeTab === 'stages'" class="p-5 flex flex-col gap-3">
        <div
          v-for="(stage, idx) in project.stages"
          :key="stage.id"
          class="flex items-start gap-4"
        >
          <!-- Icon + line -->
          <div class="flex flex-col items-center gap-1 shrink-0 pt-0.5">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              :class="
                stage.status === 'done'
                  ? 'bg-[#0a0a0a] text-white'
                  : stage.status === 'active'
                    ? 'bg-[#2563ff] text-white'
                    : 'bg-[#f0efe9] text-[#8a8a82]'
              "
            >
              <component :is="stageIconComp(stage.status)" class="w-3.5 h-3.5" />
            </div>
            <div v-if="idx < project.stages.length - 1" class="w-px flex-1 min-h-[16px] bg-[#e4e3dc]" />
          </div>

          <!-- Content -->
          <div
            class="flex-1 pb-3 border border-[#e4e3dc] rounded-[10px] p-4 mb-1 transition-all"
            :class="stage.status === 'active' ? 'border-[#2563ff]/30 bg-[#eef2ff]/30' : 'bg-white'"
          >
            <div class="flex items-center justify-between gap-3 flex-wrap">
              <p class="text-sm font-semibold text-[#0a0a0a]">{{ stage.name }}</p>
              <div class="flex items-center gap-2">
                <Badge
                  :variant="
                    stage.status === 'done' ? 'default' : stage.status === 'active' ? 'accent' : 'outline'
                  "
                >
                  {{ stage.status === 'done' ? 'Завершён' : stage.status === 'active' ? 'В работе' : 'Ожидает' }}
                </Badge>
                <Button
                  v-if="stage.status === 'active'"
                  size="sm"
                  @click="advanceStage(project.id, stage.id)"
                >
                  <Check class="w-3.5 h-3.5" />
                  Завершить
                </Button>
              </div>
            </div>

            <p v-if="stage.description" class="text-sm text-[#8a8a82] mt-1.5">{{ stage.description }}</p>

            <div v-if="stage.status === 'active'" class="flex items-center gap-2 mt-2 text-xs text-[#2563ff]">
              <div class="w-1.5 h-1.5 rounded-full bg-[#2563ff] animate-pulse" />
              Активный этап
            </div>

            <p v-if="stage.completedAt" class="text-xs text-[#8a8a82] mt-2">
              ✓ Завершён {{ stage.completedAt }}
            </p>
          </div>
        </div>
      </div>

      <!-- Comments -->
      <div v-else-if="activeTab === 'comments'">
        <div class="p-5 flex flex-col gap-4 max-h-[420px] overflow-y-auto">
          <div
            v-for="comment in project.comments"
            :key="comment.id"
            class="flex gap-3"
            :class="comment.role === 'client' ? 'flex-row-reverse' : ''"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              :class="comment.role === 'agency' ? 'bg-[#0a0a0a] text-white' : 'bg-[#eef2ff] text-[#2563ff]'"
            >
              {{ comment.author.charAt(0) }}
            </div>
            <div
              class="flex-1 max-w-[78%] flex flex-col gap-1"
              :class="comment.role === 'client' ? 'items-end' : ''"
            >
              <div
                class="rounded-[14px] px-4 py-3 text-sm leading-relaxed"
                :class="
                  comment.role === 'agency'
                    ? 'bg-[#f0efe9] text-[#0a0a0a] rounded-tl-[4px]'
                    : 'bg-[#0a0a0a] text-white rounded-tr-[4px]'
                "
              >
                {{ comment.text }}
              </div>
              <p class="text-xs text-[#8a8a82] px-1">{{ comment.author }} · {{ comment.createdAt }}</p>
            </div>
          </div>

          <div v-if="project.comments.length === 0" class="py-10 text-center text-sm text-[#8a8a82]">
            Комментариев пока нет
          </div>
        </div>

        <div class="border-t border-[#e4e3dc] p-4 flex gap-3">
          <input
            v-model="newComment"
            placeholder="Написать комментарий..."
            class="flex-1 h-10 px-3 rounded-[8px] border border-[#e4e3dc] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent"
            @keydown.enter.prevent="sendComment"
          />
          <button class="p-2 text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer">
            <Paperclip class="w-4 h-4" />
          </button>
          <Button size="sm" @click="sendComment">
            <Send class="w-3.5 h-3.5" />
            Отправить
          </Button>
        </div>
      </div>

      <!-- Documents -->
      <div v-else-if="activeTab === 'documents'" class="p-5">
        <div class="flex justify-end mb-4">
          <Button variant="outline" size="sm">
            <Paperclip class="w-4 h-4" />
            Загрузить документ
          </Button>
        </div>

        <div class="flex flex-col gap-3">
          <div
            v-for="doc in project.documents"
            :key="doc.id"
            class="border border-[#e4e3dc] rounded-[10px] px-4 py-3.5 flex items-center gap-4"
          >
            <div class="w-10 h-10 rounded-[8px] bg-[#f0efe9] flex items-center justify-center shrink-0">
              <FileText class="w-5 h-5 text-[#8a8a82]" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[#0a0a0a] truncate">{{ doc.name }}</p>
              <p class="text-xs text-[#8a8a82]">{{ doc.size }} · {{ doc.createdAt }}</p>
            </div>
            <div v-if="doc.paymentStatus" class="flex items-center gap-3">
              <span class="text-sm font-semibold text-[#0a0a0a]">
                {{ doc.amount?.toLocaleString('ru-RU') }} ₽
              </span>
              <Badge :variant="paymentMap[doc.paymentStatus].variant">
                {{ paymentMap[doc.paymentStatus].label }}
              </Badge>
            </div>
            <button class="p-1.5 text-[#8a8a82] hover:text-[#0a0a0a] hover:bg-[#f0efe9] rounded-[6px] transition-colors cursor-pointer">
              <Download class="w-4 h-4" />
            </button>
          </div>

          <div
            v-if="project.documents.length === 0"
            class="py-14 text-center text-sm text-[#8a8a82] border border-dashed border-[#e4e3dc] rounded-[10px]"
          >
            Документов пока нет
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-6 text-center text-[#8a8a82]">Проект не найден</div>

  <!-- Invite modal -->
  <Modal v-model="showInvite" title="Пригласить клиента">
    <div class="flex flex-col gap-4">
      <p class="text-sm text-[#8a8a82]">
        Отправьте ссылку клиенту. Он войдёт без регистрации и увидит только этот проект.
      </p>
      <div class="bg-[#f0efe9] border border-[#e4e3dc] rounded-[10px] p-4">
        <p class="text-xs font-medium text-[#8a8a82] mb-1">Проект</p>
        <p class="text-sm font-semibold text-[#0a0a0a]">{{ project?.name }}</p>
        <p class="text-xs text-[#8a8a82] mt-0.5">{{ project?.client }}</p>
      </div>
      <div class="flex gap-2">
        <input
          :value="inviteLink"
          readonly
          class="flex-1 h-10 px-3 rounded-[8px] border border-[#e4e3dc] bg-[#f0efe9] text-sm font-mono text-[#8a8a82] focus:outline-none"
        />
        <Button @click="copyInvite">
          <Check v-if="copiedInvite" class="w-4 h-4 text-emerald-400" />
          <Copy v-else class="w-4 h-4" />
          {{ copiedInvite ? 'Скопировано' : 'Копировать' }}
        </Button>
      </div>
      <p class="text-xs text-[#8a8a82]">
        Ссылка действительна 7 дней. После входа клиент сможет писать комментарии и просматривать документы.
      </p>
    </div>
  </Modal>
</template>
