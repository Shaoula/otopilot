<script setup lang="ts">
import { UModal } from '#components'
import type { IUser } from '~~/types'

const props = defineProps<{
  data: IUser
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const { t } = useI18n()

const isOpen = ref(false)

const isEdit = computed(() => !!props.data)

function handleSuccess() {
  // Close modal
  isOpen.value = false

  // Refresh screens
  emit('success')
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    :title="isEdit ? t('common.edit', { item: t('user').toLowerCase() }) :  t('common.add', { item: t('user').toLowerCase() })"
  >
    <UButton
      :label="isEdit ? t('common.edit', { item: t('user').toLowerCase() }) : t('common.add', { item: t('user').toLowerCase() })"
      :icon="isEdit ? 'i-lucide-pencil' : 'i-lucide-plus'"
      v-bind="$attrs"
    />

    <template #body>
      <UsersForm 
        :data="data"
        @success="handleSuccess"
      />
    </template>
  </UModal>
</template>
