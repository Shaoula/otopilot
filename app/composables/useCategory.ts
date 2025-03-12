import type { ICategory, IUser } from '~~/types'

const _baseUrl = '/api/categories'
const _baseKey = 'categories'
type BaseType = ICategory

export const useCategory = defineQuery(() => {
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<BaseType[]> => {
      const { data } = await useFetch<BaseType[]>(_baseUrl)
      return data.value ?? []
    },
  })

  const getCategory = (id: string): BaseType | undefined => {
    const foundData = data.value?.find(record => {
      return record.id === id
    })

    if (!foundData)
      return undefined

    return foundData
  }

  const refetchCategory = async (id: string) => {
    const foundData = getCategory(id)

    if (!foundData)
      return

    // Refetch category
    const { data: fetchedData } = await useFetch<BaseType>(`${_baseUrl}/${id}`)

    return fetchedData.value
  }

  const getCategoryUsers = async (id: string) => {
    const foundData = data.value?.find(category => category.id === id)

    if (!foundData)
      return []

    // Fetch users
    const { data: fetchedData } = await useFetch<IUser[]>(`${_baseUrl}/${id}/users`)

    return fetchedData.value ?? []
  }

  return {
    categories: data,
    ...rest,

    // Functions
    getCategory,
    getCategoryUsers,
    refetchCategory,
  }
})

export const useSaveCategory = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (data: BaseType) => {
      const url = data.id ? `${_baseUrl}/${data.id}` : _baseUrl
      const method = data.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
      })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { saveCategory: mutateAsync, ...rest }
})

export const useDeleteCategory = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, { method: 'DELETE' })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { deleteCategory: mutateAsync, ...rest }
})