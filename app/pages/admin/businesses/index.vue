<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()

useHead({
  title: `${t('nav.businesses', 2)} - ${t('nav.admin')}`,
})

const { refetch } = useBusiness()
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <PageTitle>
        {{ t('nav.businesses', 2) }}
      </PageTitle>

      <BusinessFormButton @success="refetch" />
    </div>

    <BusinessTable />
  </div>
</template>
