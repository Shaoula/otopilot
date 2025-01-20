<script setup lang="ts">
const navigation = [
  {
    title: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/'
  },
  {
    title: 'Vehicles',
    icon: 'i-lucide-car',
    to: '/vehicles'
  },
  {
    title: 'Analytics',
    icon: 'i-lucide-bar-chart',
    to: '/analytics'
  },
  {
    title: 'API Management',
    icon: 'i-lucide-settings',
    to: '/api-management'
  },
  {
    title: 'Settings',
    icon: 'i-lucide-settings',
    to: '/settings'
  }
]

const isOpen = ref(true)
</script>

<template>
  <div class="h-screen flex">
    <!-- Sidebar -->
    <NavSidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <NavHeader />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
