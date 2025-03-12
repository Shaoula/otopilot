import type { IBusiness, IUser } from '~~/types'

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
    const foundData = data.value?.find(record => {
      return record.id === id
    })

    if (!foundData)
      return undefined

    return foundData
  }

  const refetchBusiness = async (id: string) => {
    const business = getBusiness(id)

    if (!business)
      return

    // Refetch business
    const { data: businessData } = await useFetch<BaseType>(`${_baseUrl}/${id}`)

    return businessData.value
  }

  const getBusinessUsers = async (id: string) => {
    const business = data.value?.find(business => business.id === id)

    if (!business)
      return []

    // Fetch users
    const { data: users } = await useFetch<IUser[]>(`${_baseUrl}/${id}/users`)

    return users.value ?? []
  }

  return {
    businesses: data,
    ...rest,

    // Functions
    getBusiness,
    getBusinessUsers,
    refetchBusiness,
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