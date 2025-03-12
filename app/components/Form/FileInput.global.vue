<script setup lang="ts">
import type { IUser } from '~~/types'

interface Props {
  name?: string
  accept?: string
  preview?: boolean
  previewSize?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  autoUpload?: boolean
  uploadPath?: string
  multiple?: boolean
}

const modelValue = defineModel<string | string[]>('modelValue')

const props = withDefaults(defineProps<Props>(), {
  name: undefined,
  accept: 'image/*',
  preview: true,
  previewSize: 'md',
  disabled: false,
  autoUpload: false,
  uploadPath: undefined,
  multiple: false,
})

const emit = defineEmits<{
  // (e: 'update:modelValue', value?: string | string[]): void
  (e: 'change', file: string | string[] | undefined): void
}>()

const { t } = useI18n()
const isUploading = ref(false)

const previewSizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
  xl: 'w-48 h-48',
}

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | string[]>([])
const hasPreview = computed(() => {
  if (props.multiple && Array.isArray(modelValue.value) && modelValue.value.length > 0) 
    return true

  if (typeof modelValue.value === 'string' && modelValue.value)
    return true

  return false
})

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  console.log('handleFileChange', input.files)
  if (!input.files?.length)
    return

  isUploading.value = true

  if (props.autoUpload) {
    const { user } = useAuth()
    const businessId = (user.value as IUser)?.businessId

    if (!businessId) {
      console.log('no businessId')
      return
    }

    const uploadedFiles: string[] = []

    for (const file of Array.from(input.files)) {
      const uniqueFileName = file.name.replace(/\.[^/.]+$/, '').replace(/ /g, '-').replace(/[^\w-]/g, '-').replace(/-+/g, '-').replace(/-/g, '_')
      const uploadPath = props.uploadPath ? `${businessId}/${props.uploadPath}/${uniqueFileName}` : `${businessId}/files/${uniqueFileName}`
      const uploadUrl = `/api/businesses/${businessId}/files`

      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', uploadPath)

      console.log('uploadUrl', uploadUrl)
      console.log('formData', formData)

      const response = await $fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      })

      const data = response as { pathname: string }
      uploadedFiles.push(data.pathname)
      console.log('uploadedFiles', uploadedFiles)
    }

    const value = props.multiple ? uploadedFiles : uploadedFiles[0]
    console.log('value', value)
    // emit('update:modelValue', value)
    modelValue.value = value
    emit('change', props.multiple ? uploadedFiles : uploadedFiles[0])
    console.log('modelValue', modelValue.value)

    isUploading.value = false
    input.value = ''
    return
  }

  const files = Array.from(input.files)
  const urls = files.map(file => URL.createObjectURL(file))
  previewUrl.value = props.multiple ? urls : urls[0] as string

  const value = props.multiple ? urls : urls[0]
  // emit('update:modelValue', value)
  modelValue.value = value
  emit('change', props.multiple ? urls : urls[0])

  input.value = ''
}

function handleRemove() {
  // emit('update:modelValue', props.multiple ? [] : undefined)
  modelValue.value = props.multiple ? [] : undefined
  emit('change', props.multiple ? [] : undefined)
}

function handleFileInputClick() {
  if (props.disabled)
    return

  fileInput.value?.click()
}

// Clean up object URLs when component is unmounted
onBeforeUnmount(() => {
  if (props.multiple) {
    (modelValue.value as string[])?.forEach(url => {
      if (typeof url === 'string' && url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
  } else if (typeof modelValue.value === 'string' && modelValue.value.startsWith('blob:')) {
    URL.revokeObjectURL(modelValue.value)
  }
})
</script>

<template>
  <div class="flex items-start gap-4">
    <!-- Image Preview -->
    <div
      v-if="preview && hasPreview"
      class="flex gap-2"
      :class="props.multiple ? 'flex-wrap' : ''"
    >
      <template v-if="props.multiple">
        <div
          v-for="(url, index) in modelValue"
          :key="index"
          class="relative"
          :class="previewSizeClasses[previewSize]"
        >
          <img
            :src="`/${url}`"
            :alt="name"
            class="w-full h-full object-cover rounded-lg"
          >
          <!-- Remove Button -->
          <UButton
            v-if="!disabled"
            color="error"
            variant="solid"
            size="xs"
            icon="i-lucide-x"
            class="absolute top-2 right-2"
            @click="() => {
              const newValue = [...(modelValue as string[])]
              newValue.splice(index, 1)
              // emit('update:modelValue', newValue)
              modelValue = newValue
              emit('change', newValue)
            }"
          />
        </div>
      </template>
      <template v-else>
        <div
          class="relative"
          :class="previewSizeClasses[previewSize]"
        >
          <NuxtImg
            :src="(modelValue as string)"
            :alt="name"
            class="w-full h-full object-cover rounded-lg"
          >
          <!-- Remove Button -->
          <UButton
            v-if="!disabled"
            color="error"
            variant="solid"
            size="xs"
            icon="i-lucide-x"
            class="absolute top-2 right-2"
            @click="handleRemove"
          />
        </nuxtimg></div>
      </template>
    </div>

    <!-- Upload Button -->
    <div class="flex items-center gap-4">
      <UButton
        :label="hasPreview ? t('common.change', { item: name ?? t('labels.image') }) : t('common.upload', { item: name ?? t('labels.image').toLocaleLowerCase() })"
        color="neutral"
        variant="soft"
        :loading="isUploading"
        :disabled="disabled"
        @click="handleFileInputClick"
      />
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      :name="name"
      :accept="accept"
      class="hidden"
      :disabled="disabled"
      :multiple="multiple"
      @change="handleFileChange"
    >
  </div>
</template>
