import type { IAd } from '~~/types'

const _baseUrl = '/api/ads'
const _baseKey = 'ads'

export const useAds = defineQuery(() => {
  // Fetch
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<IAd[]> => {
      const { data } = await useFetch<IAd[]>(_baseUrl)
      return data.value ?? []
    },
  })

  const getAd = (slug: string): IAd | undefined => {
    const foundData = data.value?.find(record => record.slug === slug)

    if (!foundData)
      return undefined

    return foundData
  }

  const getAdsByBusinessId = (businessId: string): IAd[] => {
    return data.value?.filter(record => record.businessId === businessId) ?? []
  }

  const getAdBySlug = (slug: string): IAd | undefined => {
    const foundData = data.value?.find(record => record.slug === slug)

    if (!foundData)
      return undefined

    return foundData
  }
  return {
    ads: data,
    ...rest,

    // Functions
    getAd,
    getAdsByBusinessId,
    getAdBySlug,
  }
})

export const useSaveAd = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (data: IAd) => {
      const url = data.id ? `${_baseUrl}/${data.id}` : _baseUrl
      const method = data.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw createError(response)
      }

      return response.json()
    },
  })

  return { saveAd: mutateAsync, ...rest }
})

export const useDeleteAd = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw createError(response)
      }

      return response.json()
    },
  })

  return { deleteAd: mutateAsync, ...rest }
})
