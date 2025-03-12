<script setup lang="ts">
const model = defineModel<string>()

const { data } = useUsers()

const { t } = useI18n()
</script>

<template>
  <div>
    <USelectMenu
      v-model="model"
      :items="data"
      :placeholder="t('form.select', { item: t('user') })"
      label-key="name"
      value-key="id"
      class="w-full"
      :disabled="($attrs.disabled as boolean)"
    />
  </div>
</template>
