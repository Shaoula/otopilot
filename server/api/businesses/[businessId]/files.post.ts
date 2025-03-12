import { getBusinessById } from '~~/server/services/business'

export default defineEventHandler(async (event) => {
  const businessId = getRouterParam(event, 'businessId')

  if (!businessId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Business ID is required',
    })
  }

  const business = await getBusinessById(businessId)
  if (!business) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Business not found',
    })
  }

  const formData = await readFormData(event)
  const file = formData.get('file') as File
  const path = formData.get('path') as string

  console.log('file', file)
  console.log('path', path)

  const upload = await hubBlob().put(path, file, { addRandomSuffix: true })

  return upload
})
