<script setup lang="ts">
import type { IUser } from '~~/types'

const props = defineProps<{
  data: IUser
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const img = useImage()
const { t } = useI18n()

const userImage = computed(() => {
  return img(props.data.image ?? '', {
    modifiers: {
      width: 100,
      height: 100,
    },
  }, { provider: 'cloudflare' })
})

const FILTERED_FIELDS = ['id', 'image', 'role', 'banned', 'emailVerified', 'banReason', 'banExpires', 'createdAt', 'updatedAt', 'deletedAt']

const userFields = computed(() => {
  return Object.keys(props.data).filter(key => !FILTERED_FIELDS.includes(key)).map(key => ({
    id: key,
    label: key ? t(`labels.${key}`) : '',
  }))
})

function userField(key: string) {
  return t(`labels.${key}`)
}
function userFieldValue(key: keyof IUser) {
  return props.data[key] ?? '-'
}
</script>

<template>
  <UCard
    class="max-h-96 overflow-y-auto"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UAvatar :src="userImage" :alt="data.name" size="2xl" />
          <h3 class="text-lg font-semibold">
            {{ data.name }}
          </h3>
        </div>

        <UsersFormButton
          :data="data"
          color="neutral"
          variant="ghost"
          class="cursor-pointer"
          @success="emit('change')"
        />
      </div>
    </template>

    <div v-if="data" class="grid gap-4">
      <div v-for="field in userFields" :key="field.id" class="grid grid-cols-2 gap-4">
        <div class="text-sm font-medium">
          {{ userField(field.id) }}
        </div>
        <div class="text-sm">
          {{ userFieldValue(field.id as keyof IUser) }}
        </div>
      </div>
    </div>
  </UCard>
</template>
