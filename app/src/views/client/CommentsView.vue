<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { projects, addComment } from '@/stores/app';
import { agencySettings } from '@/stores/app';
import { useAuth } from '@/stores/auth';
import Button from '@/components/ui/button.vue';
import { Send, Paperclip } from 'lucide-vue-next';

const { user } = useAuth();
const project = computed(() => projects[0]!);
const comments = computed(() => project.value.comments);
const newMessage = ref('');

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  addComment(project.value.id, newMessage.value.trim(), user.value?.name ?? 'Клиент', 'client');
  newMessage.value = '';
  await nextTick();
  document.getElementById('chat-end')?.scrollIntoView({ behavior: 'smooth' });
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="px-6 py-5 border-b border-[#e4e3dc] bg-white">
      <h1 class="font-['Unbounded'] text-[18px] font-semibold text-[#0a0a0a] tracking-tight">
        Комментарии
      </h1>
      <p class="text-sm text-[#8a8a82] mt-0.5">{{ project.name }}</p>
    </div>

    <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="flex gap-3 max-w-[680px] w-full"
        :class="comment.role === 'client' ? 'flex-row-reverse ml-auto' : ''"
      >
        <div
          class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          :class="comment.role === 'agency' ? 'bg-[#0a0a0a] text-white' : 'text-white'"
          :style="comment.role === 'client' ? { backgroundColor: agencySettings.primaryColor } : {}"
        >
          {{ comment.author.charAt(0) }}
        </div>
        <div class="flex flex-col gap-1" :class="comment.role === 'client' ? 'items-end' : ''">
          <div
            class="rounded-[14px] px-4 py-3 text-sm leading-relaxed"
            :class="
              comment.role === 'agency'
                ? 'bg-white border border-[#e4e3dc] text-[#0a0a0a] rounded-tl-[4px]'
                : 'text-white rounded-tr-[4px]'
            "
            :style="comment.role === 'client' ? { backgroundColor: agencySettings.primaryColor } : {}"
          >
            {{ comment.text }}
          </div>
          <p class="text-xs text-[#8a8a82] px-1">{{ comment.author }} · {{ comment.createdAt }}</p>
        </div>
      </div>

      <div v-if="comments.length === 0" class="flex-1 flex items-center justify-center py-16">
        <p class="text-[#8a8a82] text-sm">Напишите первое сообщение</p>
      </div>

      <div id="chat-end" />
    </div>

    <div class="border-t border-[#e4e3dc] bg-white px-6 py-4">
      <div class="flex gap-3 max-w-[680px] mx-auto">
        <button class="p-2 text-[#8a8a82] hover:text-[#0a0a0a] transition-colors cursor-pointer shrink-0">
          <Paperclip class="w-5 h-5" />
        </button>
        <input
          v-model="newMessage"
          placeholder="Написать сообщение..."
          class="flex-1 h-11 px-4 rounded-[10px] border border-[#e4e3dc] text-sm text-[#0a0a0a] placeholder:text-[#8a8a82] focus:outline-none focus:ring-2 focus:border-transparent transition-all"
          :style="{ '--tw-ring-color': agencySettings.primaryColor }"
          @keydown.enter.prevent="sendMessage"
        />
        <Button @click="sendMessage" :style="{ backgroundColor: agencySettings.primaryColor, borderColor: agencySettings.primaryColor }">
          <Send class="w-4 h-4" />
          Отправить
        </Button>
      </div>
    </div>
  </div>
</template>
