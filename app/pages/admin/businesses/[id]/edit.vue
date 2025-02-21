<script setup lang="ts">
import { consola } from 'consola'
// import type { Business } from '~~/types'

definePageMeta({
  layout: 'admin',
  title: 'Edit Business',
})

const route = useRoute() as { params: { id: string } }
const { t } = useI18n()
const img = useImage()

const inputRef = ref<HTMLInputElement | null>(null)

const { getBusiness, getBusinessUsers } = useBusiness()

// Fetch business data
const business = getBusiness(route.params.id)
const businessUsers = await getBusinessUsers(route.params.id)

consola.log('business', business?.value)

const businessLogo = computed(() => {
  const imgUrl = img(business?.value.logo ?? '', {
    modifiers: {
      width: 100,
      height: 100,
    },
  }, {
    provider: 'cloudflare',
  })
  return imgUrl
})

useHead({
  title: business ? `Edit ${business.value.name}` : 'Edit Business',
})

const isUploading = ref(false)

async function handleAvatarUpload(event: Event) {
  consola.log('handleAvatarUpload')
  const input = event.target as HTMLInputElement
  if (!input.files?.length)
    return

  const file = input.files[0]
  if (!file)
    return

  try {
    consola.log('try')
    isUploading.value = true
    const formData = new FormData()
    formData.append('logo', file)

    const response = await $fetch<{ logoUrl: string }>(`/api/businesses/${business?.value.identifier}/logo`, {
      method: 'POST',
      body: formData,
    })

    if (response.logoUrl) {
      consola.log('result', response.logoUrl)
      useToast().add({
        title: t('common.success'),
        description: t('businesses.notifications.success.logoUpdated'),
        color: 'success',
      })
    }
  }
  catch (error) {
    consola.log('error', error)
    useToast().add({
      title: t('common.error'),
      description: t('businesses.notifications.error.logoUpdateFailed'),
      color: 'error',
    })
  }
  finally {
    isUploading.value = false
    inputRef.value = null

    // Refresh business data
    // const newBusiness = getBusiness(route.params.id)
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-6 flex items-center gap-4">
      <label class="block">
        <UAvatar size="3xl" :src="businessLogo" :alt="business?.name" />
        <input
          ref="inputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarUpload"
        >
      </label>
      <div>
        <h1 class="text-2xl font-semibold">
          {{ business?.name }}
        </h1>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ t('businesses.edit.description') }}
        </p>
      </div>
    </div>

    <BusinessForm :business="business" />

    <!-- Business Users -->
    <div class="mt-8">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          {{ t('businesses.users.title') }}
        </h2>
      </div>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ t('businesses.users.title') }}
            </h3>

            <UButton
              :to="`/admin/businesses/${business?.id}/users/create`"
              :label="t('common.add')"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>

        <template v-if="businessUsers.length > 0">
          <div class="flex flex-col gap-2">
            <div
              v-for="user in businessUsers"
              :key="user.id"
              class="flex gap-2"
            >
              <UAvatar :src="user.image ?? ''" :alt="user.name" size="sm" />
              <div>
                <h4 class="text-lg font-semibold">
                  {{ user.name }}
                </h4>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="flex flex-col gap-2">
          <p class="text-lg font-semibold text-neutral-500 dark:text-neutral-400">
            {{ t('businesses.users.empty.title') }}
          </p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ t('businesses.users.empty.description') }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
