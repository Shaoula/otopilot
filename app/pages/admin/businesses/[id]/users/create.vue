<script setup lang="ts">
import type { Business } from '~~/types'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { t } = useI18n()

const route = useRoute()
const { id: businessId } = route.params as { id: string }

const { getBusiness } = useBusiness()

const business = ref<Business | undefined>(undefined)

onMounted(async () => {
  business.value = getBusiness(businessId)

  if (!business.value) {
    throw createError({
      statusCode: 404,
      statusMessage: t('errors.notFound', { item: t('business').toLowerCase() }),
    })
  }
})
</script>

<template>
  <div>
    <PageTitle>
      {{ t('businesses.users.create', { business: business?.name }) }}
    </PageTitle>

    <BusinessUserForm :business-id="businessId" />
  </div>
</template>
