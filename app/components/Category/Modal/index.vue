<script setup lang="ts">
import type { ICategory } from '~~/types'

const props = defineProps<{
  data: ICategory | string
}>()

const { getCategory } = useCategory()

const category = computed(() => {
  if (typeof props.data === 'string') {
    const category = getCategory(props.data)

    if (!category)
      return null

    return category
  }

  return props.data
})
</script>

<template>
  <UModal
    :title="category?.name ?? $t('common.add', $t('category').toLowerCase())"
  >
    <UButton
      :label="category?.name"
      color="neutral"
      variant="ghost"
      class="cursor-pointer"
    />

    <template #body>
      <CategoryCard v-if="category" :data="category" />
      <div v-else>
        <!-- Category not found -->
        <div class="text-sm text-neutral-500">
          {{ $t('common.notFound') }}
        </div>
      </div>
    </template>
  </UModal>
</template>
