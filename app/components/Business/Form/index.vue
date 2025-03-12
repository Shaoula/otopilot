<script setup lang="ts">
import type { FormField } from '@/composables/useForm'
import type { IBusiness } from '~~/types'
import { consola } from 'consola'
import { z } from 'zod'

const props = defineProps<{
  data?: IBusiness
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { t } = useI18n()

const schema = z.object({
  name: z.string({
    required_error: t('errors.required', { item: t('labels.name').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.name').toLowerCase() })),
  email: z.string({
    required_error: t('errors.required', { item: t('labels.email').toLowerCase() }),
  }).email({
    message: t('errors.invalid', { item: t('labels.email').toLowerCase() }),
  }),
  phone: z
    .string({
      required_error: t('errors.required', { item: t('labels.phone').toLowerCase() }),
    })
    .regex(/^\+?\(?\d{3}\)?[-\s.]?\d{3}[-\s.]?\d{4,6}$/, t('errors.invalid', { item: t('labels.phone').toLowerCase() }))
    .nullish(),
  address: z.string().nullish(),
})

const initialState = schema.safeParse(props.data).data

const fields: FormField[] = [
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
  {
    name: 'phone',
    label: t('labels.phone'),
    type: 'tel',
    required: true,
  },
  {
    name: 'address',
    label: t('labels.address'),
    type: 'text',
  },
  {
    name: 'description',
    label: t('labels.description'),
    type: 'textarea',
  },
]

async function onSubmit(state: z.infer<typeof schema>) {
  const { saveBusiness } = useSaveBusiness()

  await saveBusiness(state as IBusiness)
}

const context = useForm({
  schema,
  initialState: props.data as Partial<IBusiness>,
  fields,
  onSubmit,
  onSuccess: () => {
    consola.success(t('businesses.notifications.success.saved'))
    emit('success')
  },
  successMessage: 'businesses.notifications.success.saved',
  submitButtonText: t('common.save', { item: t('business').toLowerCase() }),
})
</script>

<template>
  <pre>{{ initialState }}</pre>
  <FormRenderer :context="context" />
</template>
