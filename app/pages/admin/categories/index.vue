<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()

useHead({
  title: `${t('nav.categories', 2)} - ${t('nav.admin')}`,
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <PageTitle>
        {{ t('nav.categories', 2) }}
      </PageTitle>
    </div>

    <CategoryTable />
  </div>
</template>
