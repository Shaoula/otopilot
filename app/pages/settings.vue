<script setup lang="ts">
import { z } from 'zod'

const { user, client } = useAuth()

const toast = useToast()

useHead({
  title: 'Ayarlar',
})

const schema = z.object({
  name: z.string().trim().transform(value => value.toLowerCase().charAt(0).toUpperCase() + value.slice(1)),
})

const state = reactive<{ [key in keyof z.infer<typeof schema>]: z.infer<typeof schema>[key] }>({
  name: '',
})

// Mutations
async function updatePersonalInfo() {
  const result = await client.updateUser(state)

  if (result.error) {
    toast.add({
      title: 'Hata',
      description: 'Lütfen daha sonra tekrar deneyiniz.',
      icon: 'i-lucide-circle-x',
      color: 'error',
    })
  }

  if (result.data) {
    toast.add({
      title: 'Başarılı',
      description: 'Değişiklikler kaydedildi.',
      icon: 'i-lucide-circle-check',
      color: 'success',
    })
  }
}

// Lifecycle
onBeforeMount(() => {
  if (!user.value)
    return
  Object.entries(state).forEach(([key, value]) => {
    // @ts-expect-error - TODO: Fix this
    state[key as keyof typeof state] = user.value?.[key as keyof typeof user.value] ?? value
  })
})

// const isUploading = ref(false)

// const handleAvatarUpload = async (event: Event) => {
//   console.log('handleAvatarUpload')
//   const input = event.target as HTMLInputElement
//   if (!input.files?.length) return

//   const file = input.files[0]
//   if (!file) return

//   try {
//     console.log('try')
//     isUploading.value = true
//     const formData = new FormData()
//     formData.append('avatar', file)

//     const response = await $fetch<{ avatarUrl: string }>('/api/users/avatar', {
//       method: 'POST',
//       body: formData
//     })

//     if (response.avatarUrl) {
//       const result = await client.updateUser({ image: response.avatarUrl })
//       console.log('result', result)
//       useToast().add({
//         title: t('common.success'),
//         description: t('notifications.success.avatarUpdated'),
//         color: 'success'
//       })
//     }
//   } catch (error) {
//     console.log('error', error)
//     useToast().add({
//       title: t('common.error'),
//       description: t('notifications.error.avatarUpdateFailed'),
//       color: 'error'
//     })
//   } finally {
//     isUploading.value = false
//   }
// }
</script>

<template>
  <div>
    <PageTitle>
      Ayarlar
    </PageTitle>

    <!-- Avatar Section -->
    <!-- <UCard class="mb-6">
      <template #header>
        <h2 class="text-lg font-medium">{{ user?.name ?? '' }}</h2>
      </template>

      <div class="flex items-center gap-6">
        <UserAvatar size="2xl" />

        <div>
          <label class="block">
            <UButton
              :loading="isUploading"
              :disabled="isUploading"
              @click="$refs.avatarInput.click()"
            >
              {{ t('common.upload') }}
            </UButton>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarUpload"
            >
          </label>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {{ t('common.avatarHint') }}
          </p>
        </div>
      </div>
    </UCard> -->

    <!-- User settings -->
    <UCard class="mt-6">
      <UForm
        :state="state"
        :schema="schema"
        class="space-y-6"
        @submit.prevent="updatePersonalInfo"
      >
        <UFormField label="Adınız" name="name">
          <UInput
            id="name"
            v-model="state.name"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </UFormField>

        <div class="mt-6">
          <UButton type="submit" label="Kaydet" />
        </div>
      </UForm>
    </UCard>
  </div>
</template>
