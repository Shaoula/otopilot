<script setup lang="ts">
import type { Business } from '~~/types'
import { z } from 'zod'

const { t } = useI18n()
const toast = useToast()
const { user } = useAuth()
const { getBusiness } = useBusiness() 
const { saveBusiness } = useSaveBusiness()

const activeBusiness = getBusiness(user.value?.businessId)

const schema = z.object({
  logo: z.string().nullish(),
  name: z.string({
    required_error: t('errors.required', { item: t('labels.name') }),
  }),
  email: z.string({
    required_error: t('errors.required', { item: t('labels.email') }),
  }).email({
    message: t('errors.invalid', { item: t('labels.email') }),
  }),
  phone: z.string({
    required_error: t('errors.required', { item: t('labels.phone') }),
  }),
  description: z.string().nullish(),
  address: z.string().nullish(),
})

const initialState = schema.safeParse(activeBusiness).data

const fields: FormField[] = [
  {
    name: 'logo',
    label: t('labels.logo'),
    type: 'file',
    component: 'FormFileInput',
    attrs: {
      accept: 'image/*',
      autoUpload: true,
      uploadPath: 'logo',
    },
  },
  {
    name: 'name',
    label: t('labels.name'),
    type: 'text',
  },
  {
    name: 'email',
    label: t('labels.email'),
    type: 'email',
  },
  {
    name: 'phone',
    label: t('labels.phone'),
    type: 'tel',
  },
  {
    name: 'address',
    label: t('labels.address'),
    type: 'textarea',
  },
]

const isLoading = ref(false)

async function onSubmit(state: z.infer<typeof schema>) {
  try {
    isLoading.value = true

    await saveBusiness(state as Business)

    refetchActiveBusiness()
  }
  catch (error) {
    console.error('Failed to update business:', error)
    toast.add({
      title: t('businesses.settings.error'),
      description: t('businesses.settings.errorDescription'),
      icon: 'i-lucide-alert-circle',
    })
  }
  finally {
    isLoading.value = false
  }
}

const context = useForm({
  schema,
  initialState,
  fields,
  onSubmit,
  successMessage: t('businesses.settings.success'),
})

useHead({
  title: t('business.settings.title'),
})
</script>

<template>
  <div class="mx-auto max-w-3xl">
    <div class="mb-8">
      <PageTitle class="!mb-2">
        {{ t('businesses.settings.title') }}
      </PageTitle>
      <p class="text-neutral-500 dark:text-neutral-400">
        {{ t('businesses.settings.description') }}
      </p>
    </div>

    <!-- <UCard>
      <form @submit.prevent="onSubmit">
        <UFormGroup
          :label="t('business.form.logo')"
          class="mb-6"
        >
          <div class="flex items-center space-x-4">
            <img
              v-if="business?.logo"
              :src="business.logo"
              :alt="business.name"
              class="h-16 w-16 rounded object-cover"
            >
            <div
              v-else
              class="h-16 w-16 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
            >
              <UIcon
                name="i-lucide-store"
                class="h-8 w-8 text-neutral-400"
              />
            </div>
            <UButton
              color="neutral"
              variant="soft"
            >
              {{ t('business.form.uploadLogo') }}
            </UButton>
          </div>
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.name')"
          required
        >
          <UInput
            v-model="form.name"
            :placeholder="t('business.form.namePlaceholder')"
            required
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.identifier')"
          :help="t('business.form.identifierHelp')"
          required
        >
          <UInput
            v-model="form.identifier"
            :placeholder="t('business.form.identifierPlaceholder')"
            required
            disabled
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.description')"
        >
          <UTextarea
            v-model="form.description"
            :placeholder="t('business.form.descriptionPlaceholder')"
            :rows="3"
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.email')"
          required
        >
          <UInput
            v-model="form.email"
            type="email"
            :placeholder="t('business.form.emailPlaceholder')"
            required
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.phone')"
        >
          <UInput
            v-model="form.phone"
            type="tel"
            :placeholder="t('business.form.phonePlaceholder')"
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.address')"
        >
          <UTextarea
            v-model="form.address"
            :placeholder="t('business.form.addressPlaceholder')"
            :rows="2"
          />
        </UFormGroup>

        <UFormGroup
          :label="t('business.form.timezone')"
          required
        >
          <USelect
            v-model="form.timezone"
            :options="timezones"
            required
          />
        </UFormGroup>

        <div class="mt-8 flex items-center justify-end space-x-4">
          <p
            v-if="message"
            :class="message === t('business.settings.success') ? 'text-green-600' : 'text-red-600'"
            class="text-sm"
          >
            {{ message }}
          </p>
          <UButton
            type="submit"
            color="primary"
            :loading="isLoading"
          >
            {{ t('business.settings.submit') }}
          </UButton>
        </div>
      </form>
    </UCard> -->

    <FormRenderer :context="context" />
  </div>
</template>
