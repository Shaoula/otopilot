<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()

useHead({
  title: `${t('nav.ads', 2)} - ${t('nav.admin')}`,
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <PageTitle>
        {{ t('nav.ads', 2) }}
      </PageTitle>

      <AdFormButton />
    </div>

    <AdTable />
  </div>
</template>
