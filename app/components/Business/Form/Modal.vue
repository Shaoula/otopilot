<script setup lang="ts">
import type { IBusiness } from '~~/types'

// Props
defineProps<{
  item?: IBusiness
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
    :title="item ? t('businesses.edit.title') : t('businesses.add.title')"
  >
    <template #body>
      <LazyBusinessForm :item="item" @success="handleSave" />
    </template>
  </UModal>
</template>
