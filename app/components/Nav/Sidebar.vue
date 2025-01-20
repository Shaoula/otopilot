<script setup lang="ts">
import { NAV_ITEMS } from '@/constants/nav'

const ui = useUiState()
</script>

<template>
  <Transition 
    enter-active-class="transition"
    leave-active-class="transition"
    enter-from-class="transform -translate-x-full"
    leave-to-class="transform -translate-x-full"
    >
  <aside
    v-show="ui.showSidebar"
  class="w-64 flex flex-col gap-4 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900">
    <div class="flex items-center py-4 border-b border-neutral-200 dark:border-neutral-800">
        <Logo class="h-8" />
    </div>

        <UNavigationMenu 
        orientation="vertical" 
        :items="NAV_ITEMS" 
        :ui="{
          link: 'h-8',
          item: 'px-4',
        }"
        />

        <div class="flex items-center p-4 mt-auto">
            <!-- Color Mode Button -->
            <UButton
                :icon="ui.theme === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
                :label="ui.theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'"
                @click="ui.toggleTheme"
                variant="subtle"
                color="neutral" 
                class="w-full"
            />
        </div>
  </aside>
  </Transition>
</template>
