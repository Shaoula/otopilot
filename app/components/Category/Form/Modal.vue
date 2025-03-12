<script setup lang="ts">
import type { ICategory } from '~~/types'

// Props
defineProps<{
  item?: ICategory
}>()

// Emits
const emit = defineEmits<{
  (e: 'save'): void
}>()

const { t } = useI18n()

// Refs
const modal = useModal()

function handleSave() {
  modal.close()
  emit('save')
}
</script>

<template>
  <UModal
    :title="item ? t('categories.edit.title') : t('categories.add.title')"
  >
    <template #body>
      <LazyCategoryForm :item="item" @success="handleSave" />
    </template>
  </UModal>
</template>
