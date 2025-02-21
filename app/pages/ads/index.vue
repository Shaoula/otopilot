<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'


const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

const toast = useToast()

// Columns for the data table
const columns: TableColumn<IAd>[] = [
{
  accessorKey: 'title',
  header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'İlan',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => h(UButton, {
        to: `/ads/${row.original.slug}`,
        label: row.original.title,
        variant: 'link',
        color: 'neutral',
    })
},
{
  accessorKey: 'make',
  header: 'Marka',
},
{
  accessorKey: 'model',
  header: 'Model',
},
{
  accessorKey: 'year',
  header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Yıl',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    }
}, 
{
  accessorKey: 'price',
  header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Fiyat',
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => row.original.price ? row.original.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' }) : '-'
},
{
  accessorKey: 'actions',
  header: '',
  cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: {
              align: 'end'
            },
            items: getRowItems(row)
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto'
            })
        )
      )
    }
}]

function getRowItems(row: Row<IAd>) {
  return [
    {
      type: 'label',
      label: 'Actions'
    },
    {
      label: 'Copy payment ID',
      onSelect() {
        navigator.clipboard.writeText(row.original.id)

        toast.add({
          title: 'Payment ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'View customer'
    },
    {
      label: 'View payment details'
    }
  ]
}

// Mock data for demonstration
const { data, asyncStatus } = useQuery<IAd[]>({
  key: ['ads'],
  query: async (): Promise<IAd[]> => {
      const { data } = await useFetch<IAd[]>('/api/ads')
      return data.value ?? []
    },
})

// Filter states
const search = ref('')
const brandFilter = ref('')

// Available filters
const brands = computed(() => data.value?.map((ad) => ad.make).filter((make, index, self) => self.indexOf(make) === index))

// Filter data
/* TODO: USE FUSE.JS FOR SEARCH */
const filteredData = computed(() => {
  const brandFilteredData = data.value?.filter((ad) => {
    return ad.make.toLowerCase().includes(brandFilter.value.toLowerCase())
  })

  const searchFilteredData = brandFilteredData?.filter((ad) => {
    return ad.title.toLowerCase().includes(search.value.toLowerCase())
  })

  return searchFilteredData
})

// Actions
/* const editItem = (item: any) => {
  // Implement edit functionality
  console.log('Edit:', item)
}

const deleteItem = (item: any) => {
  // Implement delete functionality
  console.log('Delete:', item)
} */
</script>

<template>
  <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">İlanlar</h1>
        <UButton
          icon="i-lucide-plus"
          label="Yeni İlan"
          variant="ghost"
          to="/ads/new"
        />
      </div>

      <!-- Filters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Ara..."
          size="lg"
        />
        <USelect
          v-model="brandFilter"
          :items="brands"
          placeholder="Marka Seçin"
          size="lg"
        />
      </div>

      <!-- Data Table -->
        <UTable
          :columns="columns"
          :data="filteredData"
          :loading="asyncStatus === 'loading'"
        />
  </div>
</template>
