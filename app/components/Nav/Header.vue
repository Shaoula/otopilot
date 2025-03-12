<script setup lang="ts">
import type { DropdownMenuItem } from '#ui/types'
import type { UserWithRole } from 'better-auth/plugins';

const { t } = useI18n()
const { user, signOut } = useAuth()

const ui = useUiState()

const avatarMenuItemsBase: DropdownMenuItem[] = [
  {
    label: t('nav.settings'),
    icon: 'i-lucide-settings',
    to: '/settings'
  },
  {
    label: t('nav.logout'),
    icon: 'i-lucide-log-out',
    onSelect: () => signOut()
  }
]

const isSuperAdmin = computed(() => (user?.value as UserWithRole)?.role === 'superadmin')

const avatarMenuItems = computed(() => [
  ...(isSuperAdmin.value ? [{
    label: t('nav.admin'),
    icon: 'i-lucide-shield',
    to: '/admin'
  }] : []),
  ...avatarMenuItemsBase
])


</script>

<template>
  <header
    class="border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900">
    <UButton
:icon="ui.showSidebar ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left-open'" color="neutral"
      variant="ghost" @click="() => ui.toggleSidebar()" />
    <div class="flex-1" />

    <ClientOnly>
      <UDropdownMenu
v-slot="{ open }" :items="avatarMenuItems" :content="{
        align: 'end',
        side: 'bottom',
      }" :ui="{
        content: 'w-48',
      }">
        <UButton
:label="user?.name" :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          variant="outline" color="neutral" class="ml-auto cursor-pointer" :avatar="{
            src: user?.image ?? undefined,
            alt: user?.name,
          }" />
      </UDropdownMenu>
    </ClientOnly>
  </header>
</template>