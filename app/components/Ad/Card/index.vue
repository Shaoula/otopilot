<script setup lang="ts">
import type { IAd } from '~~/types'

const props = defineProps<{
  data: IAd
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const { t } = useI18n()

const FILTERED_FIELDS = ['id', 'createdAt', 'updatedAt', 'deletedAt']

const adFields = computed(() => {
  return Object.keys(props.data).filter(key => !FILTERED_FIELDS.includes(key)).map(key => ({
    id: key,
    label: key ? t(`labels.${key}`) : '',
  }))
})

function adField(key: string) {
  return t(`labels.${key}`)
}
function adFieldValue(key: keyof IAd) {
  return props.data?.[key] ?? '-'
}
</script>

<template>
  <div class="@container">
    <div class="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ data.title }}
                </h3>
              </div>
            </div>

            <AdFormButton
              :data="data"
              color="neutral"
              variant="ghost"
              class="cursor-pointer"
              @success="emit('change')"
            />
          </div>
        </template>

        <div v-if="data" class="grid gap-4">
          <div
            v-for="field in adFields"
            :key="field.id"
            class="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0 dark:border-neutral-800"
          >
            <div class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase break-words whitespace-pre-wrap">
              {{ adField(field.id) }}
            </div>
            <div class="text-sm text-neutral-700 dark:text-neutral-300 font-medium break-words whitespace-pre-wrap">
              {{ adFieldValue(field.id as keyof IAd) }}
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ t('ads.users.title') }}
            </h3>

            <UButton
              :to="`/ads/${data.id}/users/create`"
              :label="t('common.add')"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
