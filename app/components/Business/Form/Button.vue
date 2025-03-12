<script setup lang="ts">
import { UModal } from '#components'
import type { IBusiness } from '~~/types'

const props = defineProps<{
  data?: IBusiness
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
    :title="isEdit ? t('common.edit', { item: t('business').toLowerCase() }) :  t('common.add', { item: t('business').toLowerCase() })"
  >
    <UButton
      :label="isEdit ? t('common.edit', { item: t('business').toLowerCase() }) : t('common.add', { item: t('business').toLowerCase() })"
      :icon="isEdit ? 'i-lucide-pencil' : 'i-lucide-plus'"
      v-bind="$attrs"
    />

    <template #body>
      <BusinessForm 
        :data="data"
        @success="handleSuccess"
      />
    </template>
  </UModal>
</template>
