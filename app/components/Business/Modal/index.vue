<script setup lang="ts">
import type { IBusiness } from '~~/types'

const props = defineProps<{
  data: IBusiness | string
}>()

// const businessId = computed(() => {
//   if (typeof props.data === 'string')
//     return props.data

//   return props.data?.id
// })

const business = computed(() => {
  if (typeof props.data === 'string') {
    // TODO: get business from api
    return {
      id: props.data,
      name: 'Business Name',
      logo: 'https://via.placeholder.com/150',
    } as IBusiness
  }

  return props.data
})
</script>

<template>
  <UModal
    :title="business?.name ?? $t('common.add', $t('business').toLowerCase())"
  >
    <UButton
      :label="business?.name"
      color="neutral"
      variant="ghost"
      class="cursor-pointer"
    />

    <template #body>
      <BusinessCard :data="business" />
    </template>
  </UModal>
</template>
