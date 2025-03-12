<script setup lang="ts">
import type { FormField } from '@/composables/useForm'
import type { BusinessUser } from '~~/types'
import { consola } from 'consola'
import { z } from 'zod'

const props = defineProps<{
  businessId: string
  userId?: string
}>()

const { t } = useI18n()

const schema = z.object({
  businessId: z.string(),
  userId: z.string().optional(),
  role: z.enum(['owner', 'editor']),
})

const initialState = {
  businessId: props.businessId,
  userId: props.userId,
  role: 'editor' as const,
}

const fields: FormField[] = [
  {
    name: 'businessId',
    label: t('labels.business'),
    type: 'select',
    component: 'FormSelectBusiness',
    attrs: {
      disabled: true,
    },
  },
  {
    name: 'userId',
    label: t('labels.user'),
    type: 'select',
    component: 'FormSelectUser',
  },
  {
    name: 'role',
    label: t('labels.role'),
    type: 'select',
    options: [
      { label: t('labels.owner'), value: 'owner' },
      { label: t('labels.editor'), value: 'editor' },
    ],
    attrs: {
      labelKey: 'label',
      valueKey: 'value',
    },
  },

]

async function onSubmit(state: z.infer<typeof schema>) {
  const { getBusiness } = useBusiness()
  const { saveBusinessUser } = useSaveBusinessUser()

  const business = getBusiness(state.businessId)

  if (!business) {
    throw createError({
      statusCode: 404,
      statusMessage: t('errors.notFound', { item: t('business').toLowerCase() }),
    })
  }

  await saveBusinessUser({
    identifier: business.value.identifier,
    data: state as BusinessUser,
  })
}

const context = useForm({
  schema,
  initialState,
  fields,
  onSubmit,
  onSuccess: () => {
    consola.success(t('businesses.users.notifications.success.saved'))
  },
  successMessage: 'businesses.users.notifications.success.saved',
  submitButtonText: t('common.save'),
})
</script>

<template>
  <FormRenderer :context="context" />
</template>
