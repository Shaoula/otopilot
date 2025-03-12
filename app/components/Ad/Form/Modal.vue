<script setup lang="ts">
import type { IAd } from '~~/types'

// Props
defineProps<{
  item?: IAd
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
    :title="item ? t('ads.edit.title') : t('ads.add.title')"
  >
    <template #body>
      <LazyAdForm :item="item" @success="handleSave" />
    </template>
  </UModal>
</template>
