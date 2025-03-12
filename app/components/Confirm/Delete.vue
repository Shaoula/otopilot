<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

// Props
withDefaults(defineProps<{
  title?: string
  message?: string
}>(), {
  title: 'Delete',
})

// Emits
const emit = defineEmits<{
  (e: 'delete' | 'cancel'): void
}>()

// I18n
const { t } = useI18n()

// State
const open = ref(false)

// Methods
function onDelete() {
  open.value = false
  emit('delete')
}

function onCancel() {
  open.value = false
  emit('cancel')
}

// Computed
const actions = computed<ButtonProps[]>(() => [
  {
    label: t('common.cancel'),
    color: 'neutral',
    onClick: () => onCancel(),
  },
  {
    label: t('common.delete'),
    color: 'error',
    onClick: () => onDelete(),
  },
])
</script>

<template>
  <UModal :title="title">
    <template #body>
      <div class="text-lg font-medium">
        {{ message }}
      </div>
    </template>
    <template #footer>
      <div
        class="flex gap-2 justify-end w-full"
      >
        <UButton
          v-for="action in actions"
          :key="action.label"
          v-bind="action"
        />
      </div>
    </template>
  </UModal>
</template>
