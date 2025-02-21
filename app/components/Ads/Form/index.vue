<script setup lang="ts">
import { z } from 'zod'

interface ICreateAd {
    title: string | undefined
    description: string | undefined
    make: string | undefined
    model: string | undefined
    year: number | undefined
    color: string | undefined
    price?: number | undefined
}

const toast = useToast()

const schema = z.object({
    title: z.string({
        required_error: 'Lütfen başlık giriniz',
    }).min(1, { message: 'Başlık zorunludur' }),
    description: z.string({
        required_error: 'Lütfen açıklama giriniz',
    }).min(1, { message: 'Açıklama zorunludur' }),
    make: z.string({
        required_error: 'Lütfen marka giriniz',
    }).min(1, { message: 'Marka zorunludur' }),
    model: z.string({
        required_error: 'Lütfen model giriniz',
    }).min(1, { message: 'Model zorunludur' }),
    year: z.number({
        required_error: 'Lütfen yıl giriniz',
    }).min(1, { message: 'Yıl zorunludur' }),
    color: z.string({
        required_error: 'Lütfen renk giriniz',
    }).min(1, { message: 'Renk zorunludur' }),
    price: z.number().nullish(),
})

const formState = reactive<ICreateAd>({
    title: 'Ilk sahibinden satılık',
    description: 'Ilk sahibinden satılık',
    make: 'Audi',
    model: 'A4',
    year: 2020,
    color: 'Kırmızı',
    price: 100000,
} as ICreateAd)

const { mutateAsync: createAd, asyncStatus } = useMutation({
  mutation: (ad: ICreateAd) =>
    fetch('/api/ads', {
      method: 'POST',
      body: JSON.stringify(ad),
    }),
})

const handleSubmit = async () => {
    const ad = await createAd(formState)

    if (!ad) toast.add({ title: 'İlan oluşturulamadı', description: 'Bir hata oluştu', color: 'error' })

    toast.add({ title: 'İlan oluşturuldu', description: 'İlan başarıyla oluşturuldu', color: 'success' })
}

const brands = ['Brand 1', 'Brand 2', 'Brand 3']
const models = ['Model 1', 'Model 2', 'Model 3']
</script>

<template>
    <UForm
        class="grid gap-4"
        :state="formState"
        :schema="schema"
        @submit="handleSubmit"
        >
            <UFormField label="Marka" name="make">
                <USelectMenu v-model="formState.make" :items="brands" class="w-full" />
            </UFormField>

            <UFormField label="Model" name="model">
                <USelectMenu v-model="formState.model" :items="models" class="w-full" />
            </UFormField>

            <UFormField label="Yıl" name="year">
                <UInputNumber 
                    v-model="formState.year" 
                    class="w-full" 
                    :min="1900" 
                    :max="new Date().getFullYear() + 1" 
                    :step="1"
                    :format-options="{
                        unitDisplay: 'narrow',
                        useGrouping: false
                    }"
                    orientation="vertical"
                    />
            </UFormField>

            <UFormField label="Renk" name="color">
                <UInput v-model="formState.color" class="w-full" />
            </UFormField>

            <UFormField label="Fiyat" name="price">
                <UInputNumber 
                    v-model="formState.price" 
                    class="w-full" 
                    :min="0" 
                    :step="1000"
                    :format-options="{
                        unitDisplay: 'narrow',
                        style: 'currency',
                        currency: 'TRY',
                        currencyDisplay: 'narrowSymbol'
                    }"
                    orientation="vertical"
                    />
            </UFormField>

            <UFormField label="Görseller" name="images">
                <UInput type="file" class="w-full" multiple />
            </UFormField>

            <UFormField label="Açıklama" name="description">
                <UTextarea v-model="formState.description" :rows="4" :resize="false" class="w-full" />
            </UFormField>

            <UButton 
                :loading="asyncStatus === 'loading'"
                type="submit" 
                color="primary" 
                class="ml-auto w-fit">
                İlanı Oluştur
            </UButton>
        </UForm>
</template>