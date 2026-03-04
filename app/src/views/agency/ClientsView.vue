<script setup lang="ts">
import { ref, computed } from 'vue';
import { clients, addClient } from '@/stores/app';
import Button from '@/components/ui/button.vue';
import Badge from '@/components/ui/badge.vue';
import Modal from '@/components/ui/modal.vue';
import Input from '@/components/ui/input.vue';
import Label from '@/components/ui/label.vue';
import { Plus, Search, Mail, Phone } from 'lucide-vue-next';

const search = ref('');
const showModal = ref(false);
const saving = ref(false);

const filtered = computed(() =>
  clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.value.toLowerCase()) ||
      c.company.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

const form = ref({ name: '', email: '', phone: '', company: '' });
const formErrors = ref<Record<string, string>>({});

function validate() {
  formErrors.value = {};
  if (!form.value.name.trim()) formErrors.value.name = 'Введите имя';
  if (!form.value.email.trim()) formErrors.value.email = 'Введите email';
  return Object.keys(formErrors.value).length === 0;
}

async function submit() {
  if (!validate()) return;
  saving.value = true;
  await new Promise((r) => setTimeout(r, 400));
  addClient({
    name: form.value.name.trim(),
    email: form.value.email.trim(),
    phone: form.value.phone.trim() || '—',
    company: form.value.company.trim() || '—',
  });
  form.value = { name: '', email: '', phone: '', company: '' };
  saving.value = false;
  showModal.value = false;
}
</script>

<template>
  <div class="p-6 max-w-[900px] mx-auto">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="font-['Unbounded'] text-[20px] font-semibold text-[#0a0a0a] tracking-tight">Клиенты</h2>
        <p class="text-sm text-[#8a8a82] mt-0.5">{{ clients.length }} клиентов</p>
      </div>
      <Button @click="showModal = true">
        <Plus class="w-4 h-4" />
        Добавить клиента
      </Button>
    </div>

    <div class="relative mb-5">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8a82]" />
      <input
        v-model="search"
        placeholder="Поиск по клиентам..."
        class="w-full h-10 pl-9 pr-4 rounded-[8px] border border-[#e4e3dc] bg-white text-sm text-[#0a0a0a] placeholder:text-[#8a8a82] focus:outline-none focus:ring-2 focus:ring-[#2563ff] focus:border-transparent transition-all"
      />
    </div>

    <div class="flex flex-col gap-3">
      <div
        v-for="client in filtered"
        :key="client.id"
        class="bg-white border border-[#e4e3dc] rounded-[12px] px-5 py-4 flex items-center gap-4 hover:border-[#0a0a0a]/20 transition-colors cursor-pointer"
      >
        <div class="w-11 h-11 rounded-full bg-[#f0efe9] flex items-center justify-center text-base font-semibold text-[#0a0a0a] shrink-0">
          {{ client.name.charAt(0) }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="text-sm font-semibold text-[#0a0a0a]">{{ client.name }}</p>
            <Badge :variant="client.status === 'active' ? 'success' : 'outline'">
              {{ client.status === 'active' ? 'Активный' : 'Неактивный' }}
            </Badge>
          </div>
          <p class="text-sm text-[#8a8a82] mt-0.5">{{ client.company }}</p>
        </div>

        <div class="hidden md:flex flex-col gap-1 text-right">
          <div class="flex items-center justify-end gap-1.5 text-xs text-[#8a8a82]">
            <Mail class="w-3.5 h-3.5" />
            {{ client.email }}
          </div>
          <div class="flex items-center justify-end gap-1.5 text-xs text-[#8a8a82]">
            <Phone class="w-3.5 h-3.5" />
            {{ client.phone }}
          </div>
        </div>

        <div class="text-right shrink-0 pl-4 border-l border-[#e4e3dc]">
          <p class="text-lg font-semibold text-[#0a0a0a]">{{ client.projectsCount }}</p>
          <p class="text-xs text-[#8a8a82]">проектов</p>
        </div>
      </div>

      <div
        v-if="filtered.length === 0"
        class="bg-white border border-[#e4e3dc] rounded-[12px] py-16 text-center"
      >
        <p class="text-sm text-[#8a8a82]">{{ search ? 'Ничего не найдено' : 'Клиентов пока нет' }}</p>
        <Button v-if="!search" class="mt-4" @click="showModal = true">
          <Plus class="w-4 h-4" />
          Добавить первого клиента
        </Button>
      </div>
    </div>
  </div>

  <Modal v-model="showModal" title="Новый клиент">
    <form class="flex flex-col gap-4" @submit.prevent="submit">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5 col-span-2">
          <Label for="cName">Имя</Label>
          <Input id="cName" v-model="form.name" placeholder="Иван Петров" autofocus />
          <span v-if="formErrors.name" class="text-xs text-red-500">{{ formErrors.name }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="cEmail">Email</Label>
          <Input id="cEmail" v-model="form.email" type="email" placeholder="ivan@company.ru" />
          <span v-if="formErrors.email" class="text-xs text-red-500">{{ formErrors.email }}</span>
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="cPhone">Телефон</Label>
          <Input id="cPhone" v-model="form.phone" placeholder="+7 900 000-00-00" />
        </div>

        <div class="flex flex-col gap-1.5 col-span-2">
          <Label for="cCompany">Компания</Label>
          <Input id="cCompany" v-model="form.company" placeholder="ООО Ромашка" />
        </div>
      </div>

      <div class="flex gap-3 justify-end pt-1">
        <Button variant="outline" type="button" @click="showModal = false">Отмена</Button>
        <Button type="submit" :disabled="saving">
          {{ saving ? 'Добавляем...' : 'Добавить клиента' }}
        </Button>
      </div>
    </form>
  </Modal>
</template>
