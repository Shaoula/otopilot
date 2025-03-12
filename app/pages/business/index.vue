<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { user } = useAuth()

const { getBusiness } = useBusiness()

const userBusiness = computed(() => getBusiness(user.value?.businessId))

useHead({
  title: t('businesses.title'),
})
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-semibold">
        {{ t('businesses.title') }}
      </h1>
      <p class="mt-2 text-neutral-500 dark:text-neutral-400">
        {{ t('businesses.description') }}
      </p>
    </div>

    <!-- Businesses Grid -->
      <UCard
        class="relative group"
        :ui="{
          body: 'flex flex-col gap-y-2',
        }"
      >
        <div class="flex items-center gap-4">
          <!-- Business Logo -->
          <NuxtImg
            v-if="userBusiness.logo"
            :src="userBusiness.logo"
            :alt="userBusiness.name"
            provider="cloudflare"
            class="h-12 w-12 rounded object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="h-12 w-12 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
          >
            <UIcon
              name="i-lucide-store"
              class="h-6 w-6 text-neutral-400"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-neutral-900 dark:text-white">
              {{ userBusiness.name }}
            </h3>
            <p
              v-if="userBusiness.description"
              class="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2"
            >
              {{ userBusiness.description }}
            </p>
          </div>
        </div>

        <!-- Business Details -->
        <div class="mt-4 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
          <div v-if="userBusiness.email" class="flex items-center gap-2">
            <UIcon name="i-lucide-mail" class="h-4 w-4" />
            <span>{{ userBusiness.email }}</span>
          </div>
          <div v-if="userBusiness.phone" class="flex items-center gap-2">
            <UIcon name="i-lucide-phone" class="h-4 w-4" />
            <span>{{ userBusiness.phone }}</span>
          </div>
          <div v-if="userBusiness.address" class="flex items-center gap-2">
            <UIcon name="i-lucide-map-pin" class="h-4 w-4" />
            <span>{{ userBusiness.address }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end space-x-3">
          <UButton
            :label="t('common.manage', { item: t('business').toLocaleLowerCase() })"
            variant="soft"
            color="neutral"
            icon="i-lucide-settings"
            to="/business/settings"
          />
        </div>
      </UCard>

    <!-- Empty State -->
    <UCard
      v-if="!userBusiness"
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-store"
        class="mx-auto h-12 w-12 text-neutral-400"
      />
      <h3 class="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">
        {{ t('businesses.empty.title') }}
      </h3>
      <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {{ t('businesses.empty.description') }}
      </p>
      <div class="mt-6">
        <UButton
          to="/business/setup"
          color="primary"
        >
          {{ t('businesses.empty.action') }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>
