<script setup lang="ts">
definePageMeta({
  middleware: ['admin'],
  layout: 'admin',
})

const { t } = useI18n()

useHead({
  title: `${t('nav.users', 2)} - ${t('nav.admin')}`,
})
</script>

<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <h1 class="mb-4 text-3xl font-semibold">
        {{ t('nav.users', 2) }}
      </h1>

      <UButton
        to="/admin/users/new"
        color="neutral"
        variant="ghost"
        :label="t('common.add')"
        icon="i-lucide-plus"
      />
    </div>

    <UsersTable />
  </div>
</template>
