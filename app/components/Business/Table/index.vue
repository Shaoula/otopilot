<script setup lang="ts">
import type { TableColumn, TableData } from '#ui/types'
import type { IBusiness } from '~~/types'
import { BusinessModal } from '#components'

// const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const toast = useToast()
const { t } = useI18n()

const { businesses } = useBusiness()

const columns: TableColumn<IBusiness>[] = [
  // Logo
  {
    accessorKey: 'logo',
    header: '',
    cell: ({ row }) => h(UAvatar, {
      src: row.original.logo ?? '',
      alt: row.original.name,
      size: 'sm',
    }),
  },
  // Name
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('labels.name'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => h(UButton, {
      to: `/admin/businesses/${row.original.id}`,
      label: row.original.name,
      variant: 'ghost',
      color: 'neutral',
    }),
  },
  // Email
  {
    accessorKey: 'email',
    header: t('labels.email'),
    cell: ({ row }) => h(UButton, {
      label: row.original.email,
      onClick: () => {
        // Copy to clipboard - When copied, show a tooltip
        navigator.clipboard.writeText(row.original.email)
        toast.add({
          title: t('common.copied', { item: t('labels.email') }),
          description: t('common.copiedToClipboard', { item: t('labels.email') }),
          icon: 'i-lucide-copy',
          color: 'info',
          duration: 1500,
          type: 'foreground'
        })
      },
      title: row.original.email,
      variant: 'ghost',
      color: 'neutral',
      class: 'cursor-pointer',
    }),
  },
  // Phone
  {
    accessorKey: 'phone',
    header: t('labels.phone'),
    cell: ({ row }) => row.original.phone ? h(UButton, {
      label: row.original.phone,
      onClick: () => {
        // Copy to clipboard - When copied, show a tooltip
        navigator.clipboard.writeText(row.original.phone as string)

        // Show a tooltip
        toast.add({
          title: t('common.copied', { item: t('labels.phone') }),
          description: t('common.copiedToClipboard', { item: t('labels.phone') }),
          icon: 'i-lucide-copy',
          color: 'info',
          duration: 1500,
        })
      },
      title: row.original.phone,
      variant: 'ghost',
      color: 'neutral',
      class: 'cursor-pointer',
    }) : h(UButton, {
      // TODO: Add feature to add phone number
      label: t('common.noPhone'),
      variant: 'ghost',
      color: 'neutral',
      disabled: true,
    }),
  },
  // Address
  {
    accessorKey: 'address',
    header: t('labels.address'),
    /* cell: ({ row }) => h(UButton, {
      label: row.original.address,
      variant: 'ghost',
      color: 'neutral',
    }), */
  },
  // Actions
  {
    accessorKey: 'actions',
    header: t('labels.actions'),
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end',
            },
            items: getRowItems(row),
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto cursor-pointer',
            }),
        ),
      )
    },
  },
]

function getRowItems(row: TableData) {
  return [
    {
      label: t('common.view'),
      icon: 'i-lucide-eye',
      onSelect: () => {
        const modal = useModal()
        modal.open(BusinessModal, { data: row.original })
      },
      class: 'cursor-pointer',
    },
    {
      type: 'separator',
    },
    // Copy Link
    // TODO: Copy the business profile link to the clipboard
    // Send Email
    {
      label: t('common.send', { item: t('labels.email').toLowerCase() }),
      icon: 'i-lucide-mail',
      to: `mailto:${row.original.email}`,
      class: 'cursor-pointer',
    },
    // Call
    {
      label: t('common.call'),
      icon: 'i-lucide-phone',
      to: `tel:${row.original.phone}`,
      class: 'cursor-pointer',
    },
    { type: 'separator' },
    {
      label: t('common.delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      class: 'cursor-pointer',
      onSelect: () => {
        // TODO: Delete the business
      },
    },
  ]
}

const page = ref(1)
const pageCount = computed(() => Math.ceil(businesses.value?.length ?? 0 / 10))

const query = ref('')
const columnPinning = ref({
  left: ['logo'],
  right: ['actions'],
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex py-2 border-b border-neutral-200 dark:border-neutral-700">
      <UInput
        v-model="query"
        :placeholder="t('common.search', { entity: t('labels.users').toLowerCase() })"
        class="w-full"
      />
    </div>

    <UTable
      v-model:column-pinning="columnPinning"
      v-model:global-filter="query"
      loading-color="neutral"
      loading-animation="swing"
      :data="businesses"
      :columns="columns"
      class="max-w-full overflow-x-auto"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center h-full gap-2">
          <UIcon name="i-lucide-building-2" class="text-neutral-400 text-4xl dark:text-neutral-500" />
          <p class="font-medium text-neutral-400 dark:text-neutral-500">
            {{ t('notifications.table.notFound', { entity: t('labels.business').toLowerCase() }) }}
          </p>
        </div>
      </template>
    </UTable>

    <div
      v-if="businesses?.length && pageCount > 1"
      class="flex justify-end px-3 py-3.5 border-t border-neutral-200 dark:border-neutral-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="businesses?.length ?? 0"
      />
    </div>
  </div>
</template>
