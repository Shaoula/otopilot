<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <PageTitle>{{ t('category', 2) }}</PageTitle>
      <CategoryFormButton />
    </div>

    <!-- Filters -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <UInput v-model="search" icon="i-lucide-search" placeholder="Ara..." size="lg" />
    </div> -->

    <!-- Data Table -->
    <!-- <UTable :columns="columns" :data="rows" :loading="loading" /> -->

    <CategoryTable />
  </div>
</template>
