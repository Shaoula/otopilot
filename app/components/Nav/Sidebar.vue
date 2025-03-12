<script setup lang="ts">
import { NAV_ITEMS } from '@/constants/nav'
import { breakpointsTailwind } from '@vueuse/core'

const props = defineProps<{
  navItems?: typeof NAV_ITEMS
}>()

const { t } = useI18n()

const navs = computed(() => props.navItems ? props.navItems : NAV_ITEMS)

const translatedNavs = computed(() => {
  return navs.value.map((nav) => {
    return {
      ...nav,
      label: t(nav.label),
    }
  })
})

const route = useRoute()
// const img = useImage()

const ui = useUiState()

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smallerOrEqual('md')

// If mobile, hide the sidebar on route change
watch(route, () => {
  if (isMobile.value) {
    ui.toggleSidebar(false)
  }
})
</script>

<template>
  <Transition enter-active-class="transition" leave-active-class="transition"
    enter-from-class="transform -translate-x-full" leave-to-class="transform -translate-x-full">
    <aside v-show="ui.showSidebar"
      class="w-64 flex flex-col gap-4 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900">
      <NuxtLink to="/" class="flex items-center py-4 border-b border-neutral-200 dark:border-neutral-800">
        <Logo class="h-8" />
      </NuxtLink>

      <UNavigationMenu orientation="vertical" :items="translatedNavs" :ui="{
        link: 'h-8',
        item: 'px-4',
      }" />

      <div class="flex items-center p-4 mt-auto">
        <!-- Color Mode Button -->
        <UButton :icon="ui.theme === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'"
          :label="ui.theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'" variant="subtle" color="neutral" class="w-full"
          @click="ui.toggleTheme" />
      </div>
    </aside>
  </Transition>
</template>
