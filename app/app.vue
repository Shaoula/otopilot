<script setup lang="ts">
import { appTitle } from '~/constants'

useHead({
  title: appTitle,
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UApp>
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>