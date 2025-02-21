<script setup lang="ts">
// const { t } = useI18n()

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { id } = useRoute().params as { id: string }

const { getBusiness } = useBusiness()

const business = getBusiness(id)
</script>

<template>
  <div>
    <PageTitle>
      {{ business?.name }}
    </PageTitle>

    <template v-if="business">
      <BusinessCard :business="business" />
    </template>
  </div>
</template>
