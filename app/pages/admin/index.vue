<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'admin',
  title: 'Admin Dashboard',
})

interface Statistic {
  name: string
  value: number
  change: string
  changeType: 'increase' | 'decrease'
  icon: string
}

// TODO: Replace with real API data
const statistics: Statistic[] = [
  {
    name: 'Total Businesses',
    value: 24,
    change: '+12%',
    changeType: 'increase',
    icon: 'i-lucide-building-2',
  },
  {
    name: 'Active Users',
    value: 156,
    change: '+3.2%',
    changeType: 'increase',
    icon: 'i-lucide-users',
  },
  {
    name: 'Total Screens',
    value: 89,
    change: '+28%',
    changeType: 'increase',
    icon: 'i-lucide-monitor',
  },
  {
    name: 'Active Screens',
    value: 76,
    change: '-2.5%',
    changeType: 'decrease',
    icon: 'i-lucide-signal',
  },
]

// TODO: Replace with real activity data from API
// const recentActivity = [
//   {
//     id: 1,
//     type: 'business_created',
//     message: 'New business "Coffee Shop" created',
//     timestamp: '2 hours ago',
//     icon: 'i-lucide-building-2',
//   },
//   {
//     id: 2,
//     type: 'user_invited',
//     message: 'New user invited to "Restaurant Chain"',
//     timestamp: '4 hours ago',
//     icon: 'i-lucide-user-plus',
//   },
//   {
//     id: 3,
//     type: 'screen_added',
//     message: 'New screen added to "Pizza Place"',
//     timestamp: '5 hours ago',
//     icon: 'i-lucide-monitor',
//   },
// ]

useHead({
  title: 'Admin Dashboard',
})
</script>

<template>
  <div>
    <!-- Statistics -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <UCard
        v-for="stat in statistics"
        :key="stat.name"
        class="bg-white dark:bg-neutral-900"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              {{ stat.name }}
            </div>
            <div class="mt-1 text-3xl font-semibold">
              {{ stat.value }}
            </div>
            <div
              class="mt-1 flex items-center text-sm"
              :class="stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            >
              <UIcon
                :name="stat.changeType === 'increase' ? 'i-lucide-trending-up' : 'i-lucide-trending-down'"
                class="mr-1 h-4 w-4"
              />
              {{ stat.change }}
            </div>
          </div>
          <UIcon
            :name="stat.icon"
            class="h-12 w-12 text-neutral-400 dark:text-neutral-600"
          />
        </div>
      </UCard>
    </div>

    <!-- Recent Activity -->
    <UCard class="mt-8 bg-white dark:bg-neutral-900">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold">
            Recent Activity
          </h2>
          <!-- <UButton
            to="/admin/activity"
            color="primary"
            variant="ghost"
            icon="i-lucide-arrow-right"
            size="sm"
          >
            View all
          </UButton> -->
        </div>
      </template>

      <!-- <UTimeline
        :items="recentActivity.map(item => ({
          icon: { name: item.icon },
          title: item.message,
          description: item.timestamp,
        }))"
      /> -->
    </UCard>
  </div>
</template>
