<script setup lang="ts">
import type { INewCategory } from '~~/types'

const brands = ['Brand 1', 'Brand 2', 'Brand 3']
const models = ['Model 1', 'Model 2', 'Model 3']
// const colors = ['Red', 'Blue', 'Green']
// const years = ['2020', '2021', '2022']

const formState = reactive<INewCategory>({} as INewCategory)

const handleSubmit = (values: INewCategory) => {
    console.log(values)
}
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold">Yeni İlan</h1>

        <UForm
            class="grid gap-4"
            :state="formState"
            @submit="handleSubmit"
        >
            <UFormField label="Marka" name="brand">
                <USelectMenu :items="brands" class="w-full" />
            </UFormField>

            <UFormField label="Model" name="model">
                <USelectMenu :items="models" class="w-full" />
            </UFormField>

            <UFormField label="Yıl" name="year">
                <UInputNumber class="w-full" />
            </UFormField>

            <UFormField label="Renk" name="color">
                <UInput class="w-full" />
            </UFormField>

            <UFormField label="Fiyat" name="price">
                <UInputNumber class="w-full" />
            </UFormField>

            <UFormField label="Resim" name="image">
                <UFileInput class="w-full" />
            </UFormField>

            <UFormField label="Açıklama" name="description">
                <UTextarea :rows="4" :resize="false" class="w-full" />
            </UFormField>

            <UButton type="submit" color="primary" class="ml-auto w-fit">
                İlanı Oluştur
            </UButton>
        </UForm>
    </div>
</template>