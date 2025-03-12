import type { IUser } from '~~/types'

const _baseUrl = '/api/users'
const _baseKey = 'users'
type BaseType = IUser

export const useUser = defineQuery(() => {
  const { data, ...rest } = useQuery({
    key: [_baseKey],
    query: async (): Promise<BaseType[]> => {
      const { data } = await useFetch<BaseType[]>(_baseUrl)
      return data.value ?? []
    },
  })

  const getUser = (id: string): BaseType | undefined => {
    const foundData = data.value?.find(record => {
      return record.id === id
    })

    if (!foundData)
      return undefined

    return foundData
  }

  const refetchUser = async (id: string) => {
    const foundData = getUser(id)

    if (!foundData)
      return

    // Refetch user
    const { data: fetchedData } = await useFetch<BaseType>(`${_baseUrl}/${id}`)

    return fetchedData.value
  }

  const getUserBusinesses = async (id: string) => {
    const foundData = getUser(id)

    if (!foundData)
      return []

    // Fetch users
    const { data: fetchedData } = await useFetch<IUser[]>(`${_baseUrl}/${id}/businesses`)

    return fetchedData.value ?? []
  }

  return {
    businesses: data,
    ...rest,

    // Functions
    getUser,
    getUserBusinesses,
    refetchUser,
  }
})

export const useSaveUser = defineMutation(() => {
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

  return { saveUser: mutateAsync, ...rest }
})

export const useDeleteUser = defineMutation(() => {
  const { mutateAsync, ...rest } = useMutation({
    mutation: async (id: string) => {
      const response = await fetch(`${_baseUrl}/${id}`, { method: 'DELETE' })

      if (!response.ok)
        throw createError(response)

      return response.json()
    },
  })

  return { deleteUser: mutateAsync, ...rest }
})