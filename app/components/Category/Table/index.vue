<script setup lang="ts">
import type { TableColumn, TableData } from '#ui/types'
import type { ICategory, IBusiness } from '~~/types'
import { CategoryModal, BusinessModal } from '#components'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// const toast = useToast()
const { t } = useI18n()
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')

const { categories, getCategory } = useCategory()
const { getBusiness } = useBusiness()

const baseColumns: TableColumn<ICategory>[] = [
  // Business
  /* {
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
  }, */
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
  // Parent
  {
    accessorKey: 'parent',
    header: t('labels.parent'),
    cell: ({ row }) => {
      if (!row.original.parentId)
        return '-'

      const parent = getCategory(row.original.parentId)

      return h(CategoryModal, {
        data: parent as ICategory,
        label: parent?.name,
      })
    },
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

const adminColumns: TableColumn<ICategory>[] = [
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
  // Base columns
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
        modal.open(CategoryModal, { data: row.original })
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
        // TODO: Delete the business
      },
    },
  ]
}

const page = ref(1)
const pageCount = computed(() => Math.ceil(categories.value?.length ?? 0 / 10))

const query = ref('')
const columnPinning = ref({
  right: ['actions'],
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex py-2 border-b border-neutral-200 dark:border-neutral-700">
      <UInput v-model="query" :placeholder="t('common.search', { entity: t('category', 2).toLowerCase() })"
        class="w-full" />
    </div>

    <UTable v-model:column-pinning="columnPinning" v-model:global-filter="query" loading-color="neutral"
      loading-animation="swing" :data="categories" :columns="columns" class="max-w-full overflow-x-auto">
      <template #empty>
        <div class="flex flex-col items-center justify-center h-full gap-2">
          <UIcon name="i-lucide-folder" class="text-neutral-400 text-4xl dark:text-neutral-500" />
          <p class="font-medium text-neutral-400 dark:text-neutral-500">
            {{ t('notifications.table.notFound', { entity: t('category').toLowerCase() }) }}
          </p>
        </div>
      </template>
    </UTable>

    <div v-if="categories?.length && pageCount > 1"
      class="flex justify-end px-3 py-3.5 border-t border-neutral-200 dark:border-neutral-700">
      <UPagination v-model="page" :page-count="pageCount" :total="categories?.length ?? 0" />
    </div>
  </div>
</template>
