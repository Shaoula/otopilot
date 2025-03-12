<script setup lang="ts">
import type { IUser } from '~~/types'

const props = defineProps<{
  data: IUser | string
}>()

const { getUser } = useUser()

const user = computed(() => {
  if (typeof props.data === 'string') {
    const user = getUser(props.data)

    if (!user)
      return null

    return user
  }

  return props.data
})
</script>

<template>
  <UModal
    :title="user?.name ?? $t('common.add', $t('user').toLowerCase())"
  >
    <UButton
      :label="user?.name"
      color="neutral"
      variant="ghost"
      class="cursor-pointer"
    />

    <template #body>
      <UsersCard v-if="user" :data="user" />
      <div v-else>
        <!-- User not found -->
        <div class="text-sm text-neutral-500">
          {{ $t('common.notFound') }}
        </div>
      </div>
    </template>
  </UModal>
</template>
