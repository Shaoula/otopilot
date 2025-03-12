<script setup lang="ts">
import type { FormField } from '@/composables/useForm'
import type { ICategory, IUser } from '~~/types'
import { consola } from 'consola'
import { z } from 'zod'

const props = defineProps<{
  data?: ICategory
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { user } = useAuth()
const { t } = useI18n()


const baseSchema = z.object({
  // businessId: z.string({
  //   required_error: t('errors.required', { item: t('labels.business').toLowerCase() }),
  // }),
  name: z.string({
    required_error: t('errors.required', { item: t('labels.name').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.name').toLowerCase() })),
  slug: z.string({
    required_error: t('errors.required', { item: t('labels.slug').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.slug').toLowerCase() })),
  parentId: z.string().nullish(),
})

const adminSchema = baseSchema.extend({
  businessId: z.string({
    required_error: t('errors.required', { item: t('labels.business').toLowerCase() }),
  }),
})

const schema = computed(() => {
  const role = (user.value as IUser)?.role

  if (role === 'admin' || role === 'superadmin') {
    return adminSchema
  }

  return baseSchema
})

const initialState = schema.value.safeParse(props.data).data

const fields: FormField[] = [
  {
    name: 'name',
    label: t('labels.name'),
    type: 'text',
    required: true,
  },
]

async function onSubmit(state: z.infer<typeof schema.value>) {
  const { saveCategory } = useSaveCategory()

  await saveCategory(state as ICategory)
}

const context = useForm({
  schema: schema.value,
  initialState: props.data as Partial<ICategory>,
  fields,
  onSubmit,
  onSuccess: () => {
    consola.success(t('categories.notifications.success.saved'))
    emit('success')
  },
  successMessage: 'categories.notifications.success.saved',
  submitButtonText: t('common.save', { item: t('category').toLowerCase() }),
})
</script>

<template>
  <pre>{{ initialState }}</pre>
  <FormRenderer :context="context" />
</template>
