<script setup lang="ts">
import { z } from 'zod'
import type { FormError } from '#ui/types'

// Page Layout
definePageMeta({
  layout: 'auth',
})

// Notifications
const toast = useToast()

// Router
const router = useRouter()
const route = useRoute()

const stage = ref<'send-code' | 'verify-code'>('send-code')

// Form
const form = useTemplateRef('form')

// Form Schema
const schema = z.object({
  email: z.string({
    required_error: 'E-posta adresi gereklidir',
  }).email({
    message: 'Geçersiz e-posta adresi',
  }),
})

type Schema = z.infer<typeof schema> & { otp: [] }

const state = reactive<Schema>({
  email: '',
  otp: [],
})

const isLoading = ref(false)

const auth = useAuth()

async function onSendCode() {
  isLoading.value = true

  const sent = await auth.client.emailOtp.sendVerificationOtp({
    email: state.email,
    type: 'sign-in',
  })

  if (sent.error) {
    // TODO: Handle error
    toast.add({
      title: 'Hata',
      description: 'Lütfen daha sonra tekrar deneyiniz',
    })

    isLoading.value = false
    return
  }

  stage.value = 'verify-code'
  router.replace({ query: { email: state.email, type: stage.value } })
  isLoading.value = false
}

async function onVerifyCode(): Promise<FormError[] | undefined> {
  form.value?.clear()
  isLoading.value = true

  const user = await auth.signIn.emailOtp({
    email: state.email,
    otp: state.otp.join(''),
  })

  if (user.error) {
    // TODO: Handle error
    const errors: FormError[] = []

    errors.push({
      name: 'otp',
      message: 'Geçersiz doğrulama kodu',
    })

    form.value?.setErrors(errors)

    isLoading.value = false

    return errors
  }

  navigateTo('/')

  isLoading.value = false
}

onBeforeMount(() => {
  if (route.query.email && route.query.type) {
    state.email = route.query.email as string
    stage.value = route.query.type as 'send-code' | 'verify-code'

    if (stage.value === 'verify-code') {
      form.value?.clear()

      // Set state
      state.email = route.query.email as string
      state.otp = []
    }
  }
})
</script>

<template>
  <div class="w-full max-w-md space-y-4 p-4 bg-white rounded-lg shadow-sm border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
    <h1 class="text-2xl font-bold">
      Giriş Yap
    </h1>
    <p class="text-sm text-neutral-500">
      OtoPilot'a hoşgeldiniz
    </p>

    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      :validate-on="['change']"
      class="space-y-4"
      @submit="stage === 'send-code' ? onSendCode() : onVerifyCode()"
    >
      <template v-if="stage === 'send-code'">
        <UFormField label="E-posta" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="E-posta adresinizi giriniz"
            autofocus
            autocomplete="off"
            class="w-full"
          />
        </UFormField>
      </template>

      <template v-if="stage === 'verify-code'">
        <UFormField label="Doğrulama Kodu" name="otp">
          <UPinInput
            v-model="state.otp"
            otp
            autofocus
            required
            size="xl"
            placeholder="○"
            type="number"
            :length="6"
            @complete="() => onVerifyCode()"
          />
        </UFormField>
      </template>

      <div class="flex justify-between">
        <UButton
          type="submit"
          :label="stage === 'send-code' ? 'Kod Gönder' : 'Giriş Yap'"
          :loading="isLoading"
        />

        <UButton
          v-if="stage === 'verify-code'"
          type="button"
          variant="link"
          :label="'Kod Gönder'"
          @click="onSendCode()"
        />
      </div>
    </UForm>
  </div>
</template>
