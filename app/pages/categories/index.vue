<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

interface ICategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

const UDropdownMenu = resolveComponent('UDropdownMenu')
const UButton = resolveComponent('UButton')

// Columns for the data table
const columns: TableColumn<ICategory>[] = [
{
  accessorKey: 'name',
  header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: 'Kategori Adı',
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

function getRowItems(row: Row<ICategory>) {
  return [
    {
      type: 'label',
      label: 'İşlemler'
    },
    {
      label: 'Düzenle',
      icon: 'i-lucide-edit',
      onSelect: () => editItem(row.original)
    },
    {
      type: 'separator'
    },
    {
      label: 'Sil',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect: () => deleteItem(row.original)
    }
  ]
}

// Mock data for demonstration
const rows = ref([
  {
    id: '1',
    name: 'Otomobil',
    slug: 'otomobil',
    created_at: '2022-01-01',
    updated_at: '2022-01-01'
  },
  {
    id: '2',
    name: 'Traktör',
    slug: 'traktor',
    created_at: '2022-01-01',
    updated_at: '2022-01-01'
  }
])

// Filter states
const search = ref('')

// Table loading state
const loading = ref(false)

// Actions
const editItem = (item: ICategory) => {
  // Implement edit functionality
  console.log('Edit:', item)
}

const deleteItem = (item: ICategory) => {
  // Implement delete functionality
  console.log('Delete:', item)
}

const handleNewCategory = () => {
  console.log('Yeni Kategori')
}
</script>

<template>
  <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Kategoriler</h1>
        <UButton
          icon="i-lucide-plus"
          label="Yeni Kategori"
          variant="ghost"
          @click="handleNewCategory"
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
      </div>

      <!-- Data Table -->
        <UTable
          :columns="columns"
          :data="rows"
          :loading="loading"
        />
  </div>
</template>
