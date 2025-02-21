<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()

useHead({
  title: `${t('nav.businesses', 2)} - ${t('nav.admin')}`,
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <PageTitle>
        {{ t('nav.businesses', 2) }}
      </PageTitle>

      <UButton
        to="/admin/businesses/new"
        :label="t('common.add', t('business').toLowerCase())"
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        class="cursor-pointer"
      />
    </div>

    <BusinessTable />
  </div>
</template>
