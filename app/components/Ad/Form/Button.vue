<script setup lang="ts">
import { UModal } from '#components'
import type { IAd } from '~~/types'

const props = defineProps<{
  data?: IAd
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
    :title="isEdit ? t('common.edit', { item: t('ad').toLowerCase() }) :  t('common.add', { item: t('ad').toLowerCase() })"
  >
    <UButton
      :label="isEdit ? t('common.edit', { item: t('ad').toLowerCase() }) : t('common.add', { item: t('ad').toLowerCase() })"
      :icon="isEdit ? 'i-lucide-pencil' : 'i-lucide-plus'"
      v-bind="$attrs"
    />

    <template #body>
      <AdForm
        :data="data"
        @success="handleSuccess"
      />
    </template>
  </UModal>
</template>
