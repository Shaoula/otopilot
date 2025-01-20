<script setup lang="ts">
const { user } = useAuth()

const ui = useUiState()
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
            src: `/api/users/avatar`,
            alt: user?.name,
          }"
        />
      </UDropdownMenu>
    </ClientOnly>
      </header>
</template>