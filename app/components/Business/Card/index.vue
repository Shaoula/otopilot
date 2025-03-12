<script setup lang="ts">
import type { IBusiness, IUser } from '~~/types'

const props = defineProps<{
  data: IBusiness
}>()

const emit = defineEmits<{
  (e: 'change'): void
}>()

const img = useImage()
const { t } = useI18n()

const businessLogo = computed(() => {
  return img(props.data?.logo ?? '', {
    modifiers: {
      width: 100,
      height: 100,
    },
  }, {
    provider: 'cloudflare',
  })
})

const FILTERED_FIELDS = ['id', 'logo', 'createdAt', 'updatedAt', 'deletedAt']

const businessFields = computed(() => {
  return Object.keys(props.data).filter(key => !FILTERED_FIELDS.includes(key)).map(key => ({
    id: key,
    label: key ? t(`labels.${key}`) : '',
  }))
})

function businessField(key: string) {
  return t(`labels.${key}`)
}
function businessFieldValue(key: keyof IBusiness) {
  return props.data?.[key] ?? '-'
}

const { getBusinessUsers } = useBusiness()

const businessUsers = ref<IUser[]>([])

watch(props.data, async () => {
  if (!businessUsers.value.length) {
    businessUsers.value = await getBusinessUsers(props.data?.id ?? '')
  }
}, {
  immediate: true,
  once: true,
})
</script>

<template>
  <div class="@container">
    <div class="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UAvatar :src="businessLogo" :alt="data.name" size="3xl" />
              <div>
                <h3 class="text-lg font-semibold">
                  {{ data.name }}
                </h3>
              </div>
            </div>

            <BusinessFormButton
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
            v-for="field in businessFields"
            :key="field.id"
            class="grid grid-cols-2 gap-4 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0 dark:border-neutral-800"
          >
            <div class="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase break-words whitespace-pre-wrap">
              {{ businessField(field.id) }}
            </div>
            <div class="text-sm text-neutral-700 dark:text-neutral-300 font-medium break-words whitespace-pre-wrap">
              {{ businessFieldValue(field.id as keyof IBusiness) }}
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ t('businesses.users.title') }}
            </h3>

            <UButton
              :to="`/admin/businesses/${data.id}/users/create`"
              :label="t('common.add')"
              color="neutral"
              variant="ghost"
            />
          </div>
        </template>

        <template v-if="businessUsers.length > 0">
          <div class="flex flex-col gap-2">
            <div
              v-for="user in businessUsers"
              :key="user.id"
              class="flex gap-2"
            >
              <UAvatar :src="user.image ?? ''" :alt="user.name" size="sm" />
              <div>
                <h4 class="text-lg font-semibold">
                  {{ user.name }}
                </h4>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="flex flex-col gap-2">
          <p class="text-lg font-semibold text-neutral-500 dark:text-neutral-400">
            {{ t('businesses.users.empty.title') }}
          </p>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ t('businesses.users.empty.description') }}
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
