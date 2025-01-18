<script setup lang="ts">
const { loggedIn } = useAuth()
const isOnline = useOnline()
</script>

<template>
  <div class="h-screen w-screen flex flex-col">
    <div
      v-if="!isOnline"
      class="bg-red-500 p-2 text-center text-white"
    >
      {{ $t('offline') }}
    </div>
    <NavHeader />
    <div class="h-full max-h-full flex flex-1 gap-4 overflow-x-hidden overflow-y-auto">
      <NavSidebar v-if="loggedIn" class="shrink-0" />
      <main class="h-full w-full overflow-x-hidden overflow-y-auto p-4 pb-12 transition transition-width">
        <slot />
      </main>
    </div>
  </div>
</template>
