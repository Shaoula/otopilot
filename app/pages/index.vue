<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const stats = [
  { name: 'Total Vehicles', value: '124', icon: 'i-lucide-car' },
  { name: 'Active Listings', value: '98', icon: 'i-lucide-check-circle' },
  { name: 'Total Views', value: '1,234', icon: 'i-lucide-eye' },
  { name: 'Inquiries', value: '56', icon: 'i-lucide-message-circle' }
]
</script>

<template>
  <div>
    <UContainer>
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <UCard v-for="stat in stats" :key="stat.name" class="p-4">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-primary-50 dark:bg-primary-950 rounded-lg">
              <UIcon :name="stat.icon" class="text-primary-500 w-6 h-6" />
            </div>
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ stat.name }}</p>
              <p class="text-2xl font-semibold">{{ stat.value }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Recent Activity -->
      <UCard class="mb-8">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Recent Activity</h2>
            <UButton color="primary" variant="ghost" to="/activities">
              View All
            </UButton>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-sm text-gray-500">No recent activities</p>
        </div>
      </UCard>
    </UContainer>
  </div>
</template>
