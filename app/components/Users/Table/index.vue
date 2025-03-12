<script setup lang="ts">
import type { TableColumn } from '#ui/types'
import type { IUser } from '~~/types'
import { UsersModal } from '#components'

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UAvatar = resolveComponent('UAvatar')
// const UDropdownMenu = resolveComponent('UDropdownMenu')

const { t } = useI18n()

const { client } = useAuth()
const { data } = await client.admin.listUsers({ query: { sortBy: 'createdAt', sortDirection: 'desc' } })
const users = computed(() => data?.users as IUser[])

const roleBadgeAttrs: Record<string, object> = {
  user: {
    variant: 'soft',
    color: 'neutral',
  },
  admin: {
    variant: 'subtle',
    color: 'primary',
  },
  superadmin: {
    variant: 'outline',
    color: 'primary',
  },
}

const columns: TableColumn<IUser>[] = [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => h(UAvatar, {
      src: row.original.image ?? '',
      alt: row.original.name,
      size: 'sm',
    }),
  },
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
            ? 'i-lucide-arrow-up-wide-narrow'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      })
    },
    cell: ({ row }) => h(UsersModal, {
      data: row.original as IUser,
      label: row.original.name,
    }),
  },
  {
    accessorKey: 'email',
    header: t('labels.email'),
    cell: ({ row }) => h(UButton, {
      label: row.original.email,
      to: `mailto:${row.original.email}`,
      title: row.original.email,
      variant: 'ghost',
      color: 'neutral',
      class: 'cursor-pointer',
    }),
  },
  {
    accessorKey: 'role',
    header: t('labels.role'),
    cell: ({ row }) => {
      return h(UBadge, {
        class: 'capitalize',
        variant: 'subtle',
        ...roleBadgeAttrs[row.getValue('role') as string],
      }, () => row.getValue('role'))
    },
  },
  /* {
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
  }, */
]

/* function getRowItems(row: TableData) {
  return [
    // Profile
    {
      label: row.original.name,
      avatar: {
        src: row.original.image ?? '',
        alt: row.original.name,
      },
      // to: localePath({ name: 'admin-users-id', params: { id: row.id } }),
    },
    // Separator
    { type: 'separator' },
    // Actions
    // {
    //   type: 'label',
    //   label: t('labels.actions'),
    // },
    // View Profile
    {
      label: t('common.view'),
      icon: 'i-lucide-eye',
      onSelect: () => h(UsersModal, { user: row.original }),
      class: 'cursor-pointer',
    },
  ]
} */

const page = ref(1)
const pageCount = computed(() => Math.ceil(users.value?.length ?? 0 / 10))

const query = ref('')
const expand = ref({
  openedRows: [],
  row: null,
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
      v-model:expand="expand"
      v-model:global-filter="query"
      loading-color="neutral"
      loading-animation="swing"
      :data="users"
      :columns="columns"
      :empty-state="{ icon: 'i-lucide-users', label: t('notifications.table.notFound', { entity: t('labels.user') }) }"
      class="max-w-full overflow-x-auto"
    />

    <div
      v-if="users?.length && pageCount > 1"
      class="flex justify-end px-3 py-3.5 border-t border-neutral-200 dark:border-neutral-700"
    >
      <UPagination
        v-model="page"
        :page-count="pageCount"
        :total="users?.length ?? 0"
      />
    </div>
  </div>
</template>
