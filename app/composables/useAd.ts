import consola from 'consola'
import type { IAd, IUser } from '~~/types'

const _baseUrl = '/api/ads'
const _baseKey = 'adRecords'
type BaseType = IAd

export const useAd = defineQuery(() => {
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<BaseType[]> => {
      const { data } = await useFetch<BaseType[]>(_baseUrl)
      return data.value ?? []
    },
  })

  consola.info('useAd', data.value)

  const getAd = (slug: string): BaseType | undefined => {
    const foundData = data.value?.find(record => record.slug === slug)

    if (!foundData)
      return undefined

    return foundData
  }

  const refetchAd = async (id: string) => {
    const foundData = getAd(id)

    if (!foundData)
      return

    // Refetch category
    const { data: fetchedData } = await useFetch<BaseType>(`${_baseUrl}/${id}`)

    return fetchedData.value
  }

  const getAdUsers = async (id: string) => {
    const foundData = data.value?.find(record => record.id === id)

    if (!foundData)
      return []

    // Fetch users
    const { data: fetchedData } = await useFetch<IUser[]>(`${_baseUrl}/${id}/users`)

    return fetchedData.value ?? []
  }

  return {
    ads: data,
    ...rest,

    // Functions
    getAd,
    getAdUsers,
    refetchAd,
  }
})

export const useSaveAd = defineMutation(() => {
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

  return { saveAd: mutateAsync, ...rest }
})

export const useDeleteAd = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, { method: 'DELETE' })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { deleteAd: mutateAsync, ...rest }
})