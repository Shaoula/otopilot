<script setup lang="ts">
import type { z } from 'zod'
import type { FormContext } from '~/composables/useForm'

const props = defineProps<{
  context: FormContext<z.ZodType>
}>()

const {
  form,
  state,
  fields,
  collapsedFields,
  asyncStatus,
  handleSubmit,
  handleError,
  layout,
  submitButtonText,
  submitButtonProps,
} = toRefs(props.context)

const formClasses = computed(() => ({
  'flex flex-col gap-4 overflow-y-auto': layout.value === 'vertical',
  'grid grid-cols-2 gap-4': layout.value === 'horizontal',
  'flex flex-row gap-4 items-end': layout.value === 'inline',
}))

function resolveFieldComponent(field: typeof fields.value[number]) {
  if (field.component)
    return resolveComponent(field.component)

  switch (field.type) {
    case 'select':
      return resolveComponent('USelectMenu')
    case 'switch':
      return resolveComponent('USwitch')
    case 'number':
      return resolveComponent('UInputNumber')
    case 'date':
      return resolveComponent('FormDatePicker')
    case 'textarea':
      return resolveComponent('UTextarea')

    default:
      return resolveComponent('UInput')
  }
}

function isFieldHidden(field: typeof fields.value[number]) {
  if (typeof field.hidden === 'function')
    return field.hidden()
  return field.hidden
}

function resolveFieldAttrs(field: typeof fields.value[number]) {
  if (field.attrs)
    return field.attrs
  return {
    rows: 2,
    maxrows: 4,
    autoresize: true,
  }
}

function resolveFieldType(field: typeof fields.value[number]) {
  if (field.type === 'number')
    return undefined
  return field.type
}

// Sort fields and send collapsed fields to the end
const sortedFields = computed(() => {
  const sorted = [...fields.value]
  const collapsed = collapsedFields.value as unknown as string[]
  sorted.sort((a, b) => {
    const aName = String(a?.name ?? '')
    const bName = String(b?.name ?? '')
    console.log(aName, bName)
    const aCollapsed = collapsed?.includes(aName)
    const bCollapsed = collapsed?.includes(bName)
    
    if (aCollapsed && !bCollapsed) return 1
    if (!aCollapsed && bCollapsed) return -1
    return 0
  })
  return sorted
})

console.log(sortedFields.value)
</script>

<template>
  <UForm
    ref="form"
    :schema="context.schema"
    :state="state"
    :class="formClasses"
    @submit="handleSubmit"
    @error="handleError"
  >
    <template v-for="field in sortedFields" :key="field.name">
      <template v-if="!isFieldHidden(field) && !field.dependsOn?.some(dep => !state[dep])">
        <UFormField
          :label="field.label"
          :name="field.name"
          :required="field.required"
        >
          <component
            :is="resolveFieldComponent(field)"
            v-model="state[field.name]"
            :type="resolveFieldType(field)"
            :placeholder="field.placeholder"
            :items="field?.options"
            :multiple="field.multiple"
            color="neutral"
            class="w-full"
            v-bind="{ ...resolveFieldAttrs(field) }"
            :inherit-attrs="true"
          />
          <template #error="{ error }">
            <template v-if="error">
              {{ $t(error?.toString() ?? '') }}
            </template>
          </template>
        </UFormField>
      </template>
    </template>

    <UButton
      :loading="asyncStatus === 'loading'"
      type="submit"
      class="w-fit min-w-24 justify-center self-end"
      v-bind="submitButtonProps"
    >
      {{ $t(submitButtonText) }}
    </UButton>
  </UForm>
</template>
