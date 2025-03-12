<script setup lang="ts">
import type { IUser } from '~~/types'

// Props
defineProps<{
  item?: IUser
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
    :title="item ? t('users.edit.title') : t('users.add.title')"
  >
    <template #body>
      <LazyUsersForm :item="item" @success="handleSave" />
    </template>
  </UModal>
</template>
