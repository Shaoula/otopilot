<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug

if (!slug) {
    createError({
        statusCode: 404,
        statusMessage: 'İlan bulunamadı',
        message: 'İlan bulunamadı',
    })
}

const { getAd } = useAd()

const ad = computed(() => getAd(slug as string))

// Check if ad is loaded
watch(ad, () => {
    if (!ad.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'İlan bulunamadı',
            message: 'İlan bulunamadı',
        })
    }
}, { once: true })
</script>

<template>
    <div>
        <PageTitle>Edit Ad</PageTitle>

        <AdForm :data="ad" />
    </div>
</template>