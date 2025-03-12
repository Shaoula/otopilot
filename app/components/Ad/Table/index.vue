<script setup lang="ts">
import type { TableColumn, TableData } from '#ui/types'
import type { IAd, IBusiness, IUser } from '~~/types'
import { AdModal, BusinessModal } from '#components'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// const toast = useToast()
const { t } = useI18n()
const { user } = useAuth()

const { ads } = useAd()
const { getBusiness } = useBusiness()

const isAdmin = computed(() => {
  const role = (user.value as IUser)?.role

  return role === 'admin' || role === 'superadmin'
})

const baseColumns: TableColumn<IAd>[] = [
  // Title
  {
    accessorKey: 'title',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('labels.title'),
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
      to: `/ads/${row.original.slug}`,
      label: row.original.title,
      variant: 'ghost',
      color: 'neutral',
    }),
  },
  // Category
  {
    accessorKey: 'category',
    header: t('labels.category'),
  },
  // Price
  {
    accessorKey: 'price',
    header: t('labels.price'),
    cell: ({ row }) => row.original.price ? row.original.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-',
  },
  // Actions
  {
    accessorKey: 'actions',
    // header: t('labels.actions'),
    header: '',
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

const adminColumns: TableColumn<IAd>[] = [
  // Business
  {
    accessorKey: 'business',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('labels.business'),
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => {

      const business = getBusiness(row.original.businessId)

      return h(BusinessModal, {
        data: business as IBusiness,
        label: business?.name,
      })
    },
  },
  ...baseColumns,
]

const columns = computed(() => {
  return isAdmin.value ? adminColumns : baseColumns
})

function getRowItems(row: TableData) {
  return [
    {
      label: t('common.view'),
      icon: 'i-lucide-eye',
      onSelect: () => {
        const modal = useModal()
        modal.open(AdModal, { data: row.original })
      },
      class: 'cursor-pointer',
    },
    {
      type: 'separator',
    },
    {
      label: t('common.delete'),
      icon: 'i-lucide-trash',
      color: 'error',
      class: 'cursor-pointer',
      onSelect: () => {
        // TODO: Delete the ad
      },
    },
  ]
}

const page = ref(1)
const pageCount = computed(() => Math.ceil(ads.value?.length ?? 0 / 10))

const query = ref('')
const columnPinning = ref({
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
      :data="ads"
      :columns="columns"
      class="max-w-full overflow-x-auto"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center h-full gap-2">
          <UIcon name="i-lucide-list" class="text-neutral-400 text-4xl dark:text-neutral-500" />
          <p class="font-medium text-neutral-400 dark:text-neutral-500">
            {{ t('notifications.table.notFound', { entity: t('ad').toLowerCase() }) }}
          </p>
        </div>
      </template>
    </UTable>

    <div
      v-if="ads?.length && pageCount > 1"
      class="flex justify-end px-3 py-3.5 border-t border-neutral-200 dark:border-neutral-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="ads?.length ?? 0"
      />
    </div>
  </div>
</template>
