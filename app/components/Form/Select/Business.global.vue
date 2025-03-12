<script setup lang="ts">
const model = defineModel<string>()

const { businesses } = useBusiness()

const { t } = useI18n()

const data = computed(() => businesses.value?.map((business) => ({
  ...business,
  avatar: {
    src: business.logo,
    alt: business.name,
  },
})))

const selectedAvatar = computed(() => data.value?.find((item) => item.id === model.value)?.avatar || {})
</script>

<template>
  <div>
    <USelectMenu
      v-model="model" 
      :items="data" 
      :placeholder="t('form.select', { item: t('business') })"
      :avatar="selectedAvatar"
      label-key="name"
      value-key="id"
      class="w-full" 
      :disabled="($attrs.disabled as boolean)" 
    />
  </div>
</template>
