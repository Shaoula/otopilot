<script setup lang="ts">
const { t } = useI18n()

// Mock data for demonstration
// const { ads } = useAd()

// Filter states
// const search = ref('')
// const brandFilter = ref('')

// Available filters
// const brands = computed(() => ads.value?.map((ad) => ad.make).filter((make, index, self) => self.indexOf(make) === index))

// Filter data
/* TODO: USE FUSE.JS FOR SEARCH */
// const filteredData = computed(() => {
//   const brandFilteredData = ads.value?.filter((ad) => {
//     return ad.make?.toLowerCase().includes(brandFilter.value?.toLowerCase())
//   })

//   const searchFilteredData = brandFilteredData?.filter((ad) => {
//     return ad.title?.toLowerCase().includes(search.value?.toLowerCase())
//   })

//   return searchFilteredData
// })
</script>

<template>
  <div>
      <div class="flex justify-between items-center mb-6">
        <PageTitle>{{ t('ads.title') }}</PageTitle>
        
        <AdFormButton />
      </div>

      <AdTable />
  </div>
</template>
