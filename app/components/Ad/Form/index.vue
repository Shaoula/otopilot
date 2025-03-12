<script setup lang="ts">
import type { FormField } from '@/composables/useForm'
import type { IAd, IUser } from '~~/types'
import { consola } from 'consola'
import { z } from 'zod'

const props = defineProps<{
  data?: IAd
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { t } = useI18n()
const {user} = useAuth()

const isAdmin = computed(() => {
  const userRole = (user.value as IUser).role

  console.log(userRole)

  return userRole === 'admin' || userRole === 'superadmin'
})

const schema = z.object({
  slug: z.string({
    required_error: t('errors.required', { item: t('labels.slug').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.slug').toLowerCase() })),
  title: z.string({
    required_error: t('errors.required', { item: t('labels.name').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.name').toLowerCase() })),
  description: z.string({
    required_error: t('errors.required', { item: t('labels.description').toLowerCase() }),
  }).min(1, t('errors.required', { item: t('labels.description').toLowerCase() })),
  price: z.number().nullish(),
  make: z.string({
    required_error: t('errors.required', { item: t('labels.make').toLowerCase() }),
  }),
  model: z.string({
    required_error: t('errors.required', { item: t('labels.model').toLowerCase() }),
  }),
  color: z.string().nullish(),
  year: z.number().nullish(),
  mileage: z.number().nullish(),
  fuelType: z.string().nullish(),
  gearType: z.string().nullish(),
  bodyType: z.string().nullish(),
  engineCapacity: z.number().nullish(),
  enginePower: z.number().nullish(),
  doors: z.number().nullish().default(4),
  seats: z.number().nullish().default(5),
  transmission: z.string().nullish().default('manual'),
  features: z.array(z.string()).nullish(),
  visuals: z.array(z.string()),
})

const initialState = schema.safeParse(props.data).data

const baseFields: FormField[] = [
  {
    name: 'visuals',
    label: t('labels.visuals'),
    type: 'text',
    required: true,
    component: 'FormFileInput',
    dependsOn: isAdmin.value ? ['businessId'] : [],
    attrs: {
      multiple: true,
      autoUpload: true,
    },
  },
  {
    name: 'title',
    label: t('labels.title'),
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    label: t('labels.description'),
    type: 'textarea',
    required: true,
  },
  {
    name: 'make',
    label: t('labels.make'),
    type: 'text',
    required: true,
  },
  {
    name: 'model',
    label: t('labels.model'),
    type: 'text',
    required: true,
  },
  {
    name: 'price',
    label: t('labels.price'),
    type: 'number',
    attrs: {
      min: 0,
      step: 1,
      ormatOptions: {
        style: 'currency',
        currency: 'TRY',
        currencyDisplay: 'narrowSymbol',
        currencySign: 'accounting',
      }
    },
  },
  {
    name: 'color',
    label: t('labels.color'),
    type: 'text',
  },
  {
    name: 'year',
    label: t('labels.year'),
    type: 'number',
    attrs: {
      min: 1900,
      max: new Date().getFullYear(),
      step: 1,
      formatOptions: {
        style: 'unit',
        unit: 'year',
        unitDisplay: 'long',
      },
    },
  },
  {
    name: 'mileage',
    label: t('labels.mileage'),
    type: 'number',
    required: true,
    attrs: {
      min: 0,
      step: 1,
    },
  },
  {
    name: 'fuelType',
    label: t('labels.fuelType'),
    type: 'select',
    options: [
      { label: t('labels.gasoline'), value: 'gasoline' },
      { label: t('labels.diesel'), value: 'diesel' },
      { label: t('labels.electric'), value: 'electric' },
      { label: t('labels.hybrid'), value: 'hybrid' },
      { label: t('labels.other'), value: 'other' },
    ],
  },
  {
    name: 'gearType',
    label: t('labels.gearType'),
    type: 'select',
    options: [
      { label: t('labels.manual'), value: 'manual' },
      { label: t('labels.automatic'), value: 'automatic' },
    ],
  },
  {
    name: 'bodyType',
    label: t('labels.bodyType'),
    type: 'select',
    options: [
      { label: t('labels.sedan'), value: 'sedan' },
      { label: t('labels.hatchback'), value: 'hatchback' },
      { label: t('labels.suv'), value: 'suv' },
      { label: t('labels.other'), value: 'other' },
    ],
  },
  {
    name: 'engineCapacity',
    label: t('labels.engineCapacity'),
    type: 'number',
  },
  {
    name: 'enginePower',
    label: t('labels.enginePower'),
    type: 'number',
    attrs: {
      min: 0,
      step: 1,
    },
  },
  {
    name: 'doors',
    label: t('labels.doors'),
    type: 'number',
    attrs: {
      min: 0,
      step: 1,
    },
  },
  {
    name: 'seats',
    label: t('labels.seats'),
    type: 'number',
    attrs: {
      min: 0,
      step: 1,
    },
  },
]

const adminFields: FormField[] = [
  {
    name: 'businessId',
    label: t('labels.business'),
    type: 'select',
    component: 'FormSelectBusiness',
  },
]


const fields = computed(() => {
  if (isAdmin.value) return [...adminFields, ...baseFields]

  return baseFields
})

const collapsedFields = computed(() => baseFields.filter((field) => {
  if (!field.required) return false

  return field.name
}))

async function onSubmit(state: z.infer<typeof schema>) {
  const { saveAd } = useSaveAd()

  await saveAd({ id: props.data?.id, ...state} as IAd)

  context.resetForm()
}

const context = useForm({
  schema,
  initialState,
  fields,
  collapsedFields,
  onSubmit,
  onSuccess: () => {
    consola.success(t('ads.notifications.success.saved'))
    emit('success')
  },
  successMessage: 'ads.notifications.success.saved',
  submitButtonText: t('common.save', { item: t('ad').toLowerCase() }),
})
</script>

<template>
  <pre>{{ initialState }}</pre>
  <FormRenderer :context="context" />
</template>
