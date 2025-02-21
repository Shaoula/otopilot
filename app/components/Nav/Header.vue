<script setup lang="ts">
import type { UserWithRole } from 'better-auth/plugins';

const { user } = useAuth()

const ui = useUiState()

const avatarMenuItemsBase = [
  {
    label: 'Ayarlar',
    icon: 'i-lucide-settings',
    to: '/settings'
  },
  {
    label: 'Çıkış Yap',
    icon: 'i-lucide-log-out',
    to: '/auth/logout'
  }
]

const isSuperAdmin = computed(() => (user?.value as UserWithRole)?.role === 'superadmin')

const avatarMenuItems = computed(() => [
  ...(isSuperAdmin.value ? [{
    label: 'Yönetim Paneli',
    icon: 'i-lucide-shield',
    to: '/admin'
  }] : []),
  ...avatarMenuItemsBase
])


</script>

<template>
    <header class="border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900">
        <UButton
          :icon="ui.showSidebar ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'"
          color="neutral"
          variant="ghost"
          @click="() => ui.toggleSidebar()"
        />
        <div class="flex-1" />

        <ClientOnly>
      <UDropdownMenu
        v-slot="{ open }"
        :items="avatarMenuItems"
        :content="{
          align: 'end',
          side: 'bottom',
        }"
        :ui="{
          content: 'w-48',
        }"
      >
        <UButton
          :label="user?.name"
          :trailing-icon="open ? 'i-solar-alt-arrow-up-linear' : 'i-solar-alt-arrow-down-linear'"
          variant="outline"
          color="neutral"
          class="ml-auto cursor-pointer"
          :avatar="{
            src: user?.image ?? undefined,
            alt: user?.name,
          }"
        />
      </UDropdownMenu>
    </ClientOnly>
      </header>
</template>