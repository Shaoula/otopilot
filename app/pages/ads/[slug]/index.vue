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

const asyncStatus = computed(() => ad.value ? 'loaded' : 'loading')

// Image gallery state
const currentImageIndex = ref(0)
const showGalleryModal = ref(false)

// Navigation functions for gallery
const nextImage = () => {
    if (!ad.value?.visuals) return
    currentImageIndex.value = (currentImageIndex.value + 1) % ad.value.visuals.length
}

const previousImage = () => {
    if (!ad.value?.visuals) return
    currentImageIndex.value = currentImageIndex.value === 0 
        ? ad.value.visuals.length - 1 
        : currentImageIndex.value - 1
}

// Format price with Turkish Lira
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY'
    }).format(price)
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

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
        <USkeleton v-if="asyncStatus === 'loading'" class="w-full aspect-16/9" />

        <div v-else-if="ad">
            <!-- Breadcrumb -->
            <UBreadcrumb
                :items="[
                    { label: 'Anasayfa', to: '/' },
                    { label: 'İlanlar', to: '/ads' },
                    { label: ad.title, to: route.fullPath }
                ]"
                class="mb-6"
            />

            <!-- Ad Header -->
            <div class="flex flex-col lg:flex-row justify-between mb-6 gap-8">
                <!-- Ad Title and Date -->
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                        <h1 class="text-3xl font-bold">{{ ad.title }}</h1>
                        <p class="text-sm text-neutral-500">{{ formatDate(ad.createdAt?.toString() ?? '') }}</p>
                    </div>
                    <div>
                        <p class="text-sm text-neutral-500 line-clamp-2">{{ ad.description }}</p>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- Year -->
                        <UBadge
                            color="info"
                            variant="soft"
                            size="lg"
                            icon="i-lucide-calendar"
                            :label="ad.year ? ad.year : '___'"
                            class="rounded-full px-4 py-2"
                        />

                        <!-- Mileage -->
                        <UBadge
                            color="info"
                            variant="soft"
                            size="lg"
                            icon="i-lucide-gauge"
                            :label="ad.mileage ? ad.mileage.toLocaleString() + ' km' : '___'"
                            class="rounded-full px-4 py-2"
                        />

                        <!-- Transmission -->
                        <UBadge
                            color="info"
                            variant="soft"
                            size="lg"
                            icon="i-solar-transmission-linear"
                            :label="ad.transmission ? ad.transmission === 'manual' ? 'Manuel' : 'Otomatik' : '___'"
                            class="rounded-full px-4 py-2"
                        />

                        <!-- Fuel Type -->
                        <UBadge
                            color="info"
                            variant="soft"
                            size="lg"
                            icon="i-lucide-fuel"
                            :label="ad.fuelType ? ad.fuelType : '___'"
                            class="rounded-full px-4 py-2"
                        />
                    </div>
                </div>

                <!-- Ad Actions -->
                <div class="flex flex-col gap-2 shrink-0">
                    <!-- Share -->
                    <div class="flex items-center gap-2">
                        <UButton
                            color="neutral"
                            variant="ghost"
                            icon="i-lucide-share"
                            label="Paylaş"
                        />
                    </div>

                    <!-- Price -->
                    <div class="flex items-center gap-2">
                        <h2 class="text-3xl font-bold">{{ formatPrice(ad.price ?? 0) }}</h2>
                    </div>
                </div>
            </div>

            <!-- Ad Images (Gallery) -->
             <!-- <div class="flex flex-col lg:flex-row gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <UCard class="overflow-hidden">
                        <div class="relative">
                            <NuxtImg
                                v-if="ad.visuals?.[currentImageIndex]"
                                :src="ad.visuals?.[currentImageIndex]"
                                class="w-full h-[400px] object-cover cursor-pointer"
                                @click="showGalleryModal = true"
                            />
                            <div v-else class="w-full h-[400px] bg-neutral-100 flex items-center justify-center dark:bg-neutral-800">
                                <p class="text-neutral-500 dark:text-neutral-400">No image</p>
                            </div>
                        </div>
                    </UCard>
                </div>
                <div class="space-y-6">
                    <UCard>
                        <template #header>
                            <h2 class="text-xl font-semibold">Araç Detayları</h2>
                        </template>
                    </UCard>
                </div>
             </div> -->


            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left Column: Images and Main Details -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Image Gallery -->
                    <UCard class="overflow-hidden">
                        <div class="relative">
                            <NuxtImg
                                v-if="ad.visuals?.[currentImageIndex]"
                                :src="ad.visuals?.[currentImageIndex]"
                                class="w-full h-[400px] object-cover cursor-pointer"
                                @click="showGalleryModal = true"
                            />
                            <div v-else class="w-full h-[400px] bg-neutral-100 flex items-center justify-center dark:bg-neutral-800">
                                <p class="text-neutral-500 dark:text-neutral-400">
                                    <Icon name="i-lucide-image" class="w-10 h-10" />
                                </p>
                            </div>
                            <!-- Gallery Navigation -->
                            <div
                                v-if="ad.visuals?.length && ad.visuals?.length > 1"
                            class="absolute inset-0 flex items-center justify-between p-4">
                                <UButton
                                    color="primary"
                                    variant="solid"
                                    icon="i-lucide-chevron-left"
                                    @click="previousImage"
                                />
                                <UButton
                                    color="primary"
                                    variant="solid"
                                    icon="i-lucide-chevron-right"
                                    @click="nextImage"
                                />
                            </div>
                        </div>
                        <!-- Thumbnail Strip -->
                        <div class="flex gap-2 p-4 overflow-x-auto">
                            <div
                                v-for="(image, index) in ad.visuals"
                                :key="index"
                                class="shrink-0"
                            >
                                <NuxtImg
                                    :src="image"
                                    class="w-20 h-20 object-cover rounded cursor-pointer transition-all"
                                    :class="{ 'ring-2 ring-primary-500': currentImageIndex === index }"
                                    @click="currentImageIndex = index"
                                />
                            </div>
                        </div>
                    </UCard>

                    <!-- Vehicle Details -->
                    <UCard>
                        <template #header>
                            <h2 class="text-xl font-semibold">Araç Detayları</h2>
                        </template>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div v-if="ad.make" class="space-y-1">
                                <p class="text-sm text-gray-500">Marka</p>
                                <p class="font-medium">{{ ad.make }}</p>
                            </div>
                            <div v-if="ad.model" class="space-y-1">
                                <p class="text-sm text-gray-500">Model</p>
                                <p class="font-medium">{{ ad.model }}</p>
                            </div>
                            <div v-if="ad.year" class="space-y-1">
                                <p class="text-sm text-gray-500">Yıl</p>
                                <p class="font-medium">{{ ad.year }}</p>
                            </div>
                            <div v-if="ad.mileage" class="space-y-1">
                                <p class="text-sm text-gray-500">Kilometre</p>
                                <p class="font-medium">{{ ad.mileage.toLocaleString() }} km</p>
                            </div>
                            <div v-if="ad.fuelType" class="space-y-1">
                                <p class="text-sm text-gray-500">Yakıt</p>
                                <p class="font-medium">{{ ad.fuelType }}</p>
                            </div>
                            <div v-if="ad.transmission" class="space-y-1">
                                <p class="text-sm text-gray-500">Vites</p>
                                <p class="font-medium">{{ ad.transmission }}</p>
                            </div>
                        </div>
                    </UCard>

                    <!-- Description -->
                    <UCard>
                        <template #header>
                            <h2 class="text-xl font-semibold">Açıklama</h2>
                        </template>
                        <p class="whitespace-pre-line">{{ ad.description }}</p>
                    </UCard>
                </div>

                <!-- Right Column: Price and Contact -->
                <div class="space-y-6">
                    <!-- Price Card -->
                    <UCard>
                        <div class="text-center">
                            <p class="text-sm text-gray-500 mb-1">Fiyat</p>
                            <p class="text-3xl font-bold text-primary-600">
                                {{ formatPrice(ad.price ?? 0) }}
                            </p>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>

        <!-- Image Gallery Modal -->
        <UModal v-model:open="showGalleryModal">
            <template #content>
            <UCard>
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-semibold">Galeri</h3>
                        <UButton
                            color="primary"
                            variant="ghost"
                            icon="i-lucide-x"
                            @click="showGalleryModal = false"
                        />
                    </div>
                </template>
                <div class="relative">
                    <NuxtImg
                        v-if="ad?.visuals?.[currentImageIndex]"
                        :src="ad.visuals?.[currentImageIndex]"
                        class="w-full h-[600px] object-contain"
                    />
                    <div class="absolute inset-0 flex items-center justify-between p-4">
                        <UButton
                            color="primary"
                            variant="solid"
                            icon="i-lucide-chevron-left"
                            @click="previousImage"
                        />
                        <UButton
                            color="primary"
                            variant="solid"
                            icon="i-lucide-chevron-right"
                            @click="nextImage"
                        />
                    </div>
                </div>
                <template #footer>
                    <p class="text-center text-sm text-gray-500">
                        {{ currentImageIndex + 1 }} / {{ ad?.visuals?.length }}
                    </p>
                </template>
            </UCard>
            </template>
        </UModal>
    </div>
</template>