<script setup lang="ts">
import type { IAd } from '~~/types'

const props = defineProps<{
  data: IAd | string
}>()

const { getAd } = useAd()

const ad = computed(() => {
  if (typeof props.data === 'string') {
    const ad = getAd(props.data)

    if (!ad)
      return null

    return ad
  }

  return props.data
})
</script>

<template>
  <UModal
    :title="ad?.title ?? $t('common.add', $t('ad').toLowerCase())"
  >
    <UButton
      :label="ad?.title"
      color="neutral"
      variant="ghost"
      class="cursor-pointer"
    />

    <template #body>
      <AdCard v-if="ad" :data="ad" />
      <div v-else>
        <!-- Ad not found -->
        <div class="text-sm text-neutral-500">
          {{ $t('common.notFound') }}
        </div>
      </div>
    </template>
  </UModal>
</template>
