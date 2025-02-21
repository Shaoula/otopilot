import type { z } from 'zod'
import type { Form, FormErrorEvent } from '#ui/types'

export type FieldType = 'text' | 'textarea' | 'email' | 'tel' | 'date' | 'select' | 'switch' | 'number'

export interface FormField {
  name: string
  label: string
  type: FieldType
  component?: string
  placeholder?: string
  options?: Array<{ label: string, value: string | number | boolean }>
  required?: boolean
  multiple?: boolean
  hidden?: boolean | (() => boolean)
  attrs?: Record<string, unknown>
  transform?: (value: unknown) => unknown
  validate?: (value: unknown) => string | true
  dependsOn?: string[]
}

export interface UseFormOptions<T extends z.ZodType> {
  schema: T
  fields: FormField[] | ComputedRef<FormField[]> | Ref<FormField[]>
  initialState?: Partial<z.infer<T>>
  onInput?: (state: z.infer<T>, setState: (state: z.infer<T>) => void) => void
  onSubmit: (state: z.infer<T>) => Promise<void> | void
  onSuccess?: () => void
  successMessage?: string
  transformBeforeSubmit?: (state: z.infer<T>) => unknown
  layout?: 'vertical' | 'horizontal' | 'inline'
  submitButtonText?: string
  submitButtonProps?: Record<string, unknown>
}

export interface FormContext<T extends z.ZodType> {
  schema: T
  form: Ref<Form<T> | undefined>
  state: z.infer<T> & { [key: string]: unknown }
  fields: ComputedRef<FormField[]>
  asyncStatus: Ref<'idle' | 'loading' | 'error'>
  handleSubmit: () => Promise<void>
  handleError: (event: FormErrorEvent) => void
  setFormErrors: (errors: Array<{ name: string, message: string }>) => void
  resetForm: () => void
  layout: 'vertical' | 'horizontal' | 'inline'
  submitButtonText: string
  submitButtonProps: Record<string, unknown>
}

interface FormError extends Error {
  statusMessage?: string
}

export function useForm<T extends z.ZodType>({
  schema,
  fields,
  initialState = {},
  onSubmit,
  onSuccess,
  successMessage = 'notifications.success.saved',
  transformBeforeSubmit,
  layout = 'vertical',
  submitButtonText = 'form.button.save',
  submitButtonProps = {},
}: UseFormOptions<T>): FormContext<T> {
  const toast = useToast()
  const form = ref<Form<T>>()
  const asyncStatus = ref<'idle' | 'loading' | 'error'>('idle')

  const state = reactive<z.infer<z.infer<T>> & { [key: string]: unknown }>(
    initialState as z.infer<T> & { [key: string]: unknown },
  )

  const fieldsRef = computed(() => {
    if (isRef(fields)) {
      return fields.value
    }
    return fields
  })

  // Watch for changes in fields with dependencies
  watch(
    () => ({ ...state }),
    () => {
      fieldsRef.value.forEach((field) => {
        if (field.dependsOn?.length) {
          const shouldClear = field.dependsOn.some((dependency) => {
            const dependencyValue = state[dependency]
            return dependencyValue === undefined
              || dependencyValue === null
              || dependencyValue === ''
              || dependencyValue === false
          })

          if (shouldClear && state[field.name] !== undefined) {
            state[field.name] = undefined
          }
        }
      })
    },
    {
      deep: true,
      immediate: true,
    },
  )

  async function handleSubmit() {
    console.log('Submitting form', state)
    try {
      asyncStatus.value = 'loading'
      const data = transformBeforeSubmit ? transformBeforeSubmit(state) : state
      await onSubmit(data)

      toast.add({
        description: successMessage,
        color: 'success',
        icon: 'i-solar-check-circle-linear',
      })

      onSuccess?.()
      asyncStatus.value = 'idle'
    }
    catch (error) {
      asyncStatus.value = 'error'
      const errorMessage = (error as FormError)?.statusMessage || (error as FormError)?.message

      if (errorMessage === 'emailAlreadyTaken') {
        form.value?.setErrors([
          {
            name: 'email',
            message: 'E-posta zaten alınmış',
          },
        ])
      }

      toast.add({
        description: errorMessage,
        color: 'error',
        icon: 'i-solar-shield-warning-broken',
      })
    }
  }

  function handleError(event: FormErrorEvent) {
    const element = document.getElementById(event.errors[0]?.id as string)
    element?.focus()
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function setFormErrors(errors: Array<{ name: string, message: string }>) {
    form.value?.setErrors(errors)
  }

  function resetForm() {
    Object.keys(state).forEach((key) => {
      state[key] = initialState[key as keyof typeof initialState] ?? undefined
    })
    form.value?.clear()
  }

  return {
    schema,
    form,
    state,
    fields: fieldsRef,
    asyncStatus,
    handleSubmit,
    handleError,
    setFormErrors,
    resetForm,
    layout,
    submitButtonText,
    submitButtonProps,
  }
}
