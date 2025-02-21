<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()
</script>

<template>
  <div>
    <PageTitle>
      {{ t('common.add', { item: t('business') }) }}
    </PageTitle>

    <BusinessForm />
  </div>
</template>
