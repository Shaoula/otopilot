<script setup lang="ts">
import type { IBusiness } from '~~/types'

definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

const { id } = useRoute().params as { id: string }

if (!id)
  navigateTo('/admin/businesses')

const { getBusiness, refetchBusiness } = useBusiness()

const business = ref<IBusiness | undefined>(undefined)

business.value = getBusiness(id)

const refresh = async () => {
  const refreshedBusiness = await refetchBusiness(id)

  if (!refreshedBusiness)
    return

  business.value = refreshedBusiness
}
</script>

<template>
  <div>
    <PageTitle>
      {{ business?.name }}
    </PageTitle>

    <template v-if="business">
      <BusinessCard :data="business" @change="refresh" />
    </template>
  </div>
</template>
