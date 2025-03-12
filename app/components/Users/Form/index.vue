<script setup lang="ts">
import type { FormField } from '@/composables/useForm'
import type { IUser } from '~~/types'
import { consola } from 'consola'
import { z } from 'zod'

const props = defineProps<{
  data?: IUser
}>()

const { t } = useI18n()

const schema = z.object({
  businessId: z.string({
    required_error: t('errors.required', { item: t('labels.business').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.business').toLowerCase() })),
  name: z.string({
    required_error: t('errors.required', { item: t('labels.name').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.name').toLowerCase() })),
  email: z.string({
    required_error: t('errors.required', { item: t('labels.email').toLowerCase() }),
  }).email({
    message: t('errors.invalid', { item: t('labels.email').toLowerCase() }),
  }),
})

const fields: FormField[] = [
  {
    name: 'businessId',
    label: t('labels.business'),
    type: 'select',
    component: 'FormSelectBusiness',
    required: true,
  },
  {
    name: 'name',
    label: t('labels.name'),
    type: 'text',
    required: true,
  },
  {
    name: 'email',
    label: t('labels.email'),
    type: 'email',
    required: true,
  },
]

async function onSubmit(state: z.infer<typeof schema>) {
  const { saveUser } = useSaveUser()

  await saveUser(state as IUser)
}

const context = useForm({
  schema,
  initialState: props.data,
  fields,
  onSubmit,
  onSuccess: () => {
    consola.success(t('users.notifications.success.saved'))
  },
  successMessage: 'users.notifications.success.saved',
  submitButtonText: t('common.save', { item: t('user').toLowerCase() }),
})
</script>

<template>
  <FormRenderer :context="context" />
</template>
