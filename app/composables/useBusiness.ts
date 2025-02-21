import type { IBusiness } from '~~/types'

const _baseUrl = '/api/businesses'
const _baseKey = 'businesses'
type BaseType = IBusiness

export const useBusiness = defineQuery(() => {
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<BaseType[]> => {
      const { data } = await useFetch<BaseType[]>(_baseUrl)
      return data.value ?? []
    },
  })

  const getBusiness = (id: string): BaseType | undefined => {
    const foundData = data.value?.find(record => record.id === id)

    if (!foundData)
      return undefined

    return foundData
  }

  return {
    businesses: data,
    ...rest,

    // Functions
    getBusiness,
  }
})

export const useSaveBusiness = defineMutation(() => {
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

  return { saveBusiness: mutateAsync, ...rest }
})

export const useDeleteBusiness = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, { method: 'DELETE' })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { deleteBusiness: mutateAsync, ...rest }
})