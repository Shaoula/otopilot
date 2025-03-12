import { adCreateSchema } from '~~/schemas/zod'
import { createAd } from '~~/server/services/ad'
import { verifyBusinessAccess } from '~~/server/services/businessUser'

export default defineEventHandler(async (event) => {
    // Get auth session
    const authSession = await getAuthSession(event)

    // Check if user is authenticated
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Get data from request
    const data = JSON.parse(await readBody(event))

    // Check if business ID is valid
    const businessId = getRouterParam(event, 'businessId')
    if (!businessId) throw createError({ statusCode: 404, statusMessage: 'Business ID not found' })

    // Check if user has access to business
    const hasAccess = await verifyBusinessAccess(authSession.user, businessId)
    if (!hasAccess) throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })

    // Validate data
    const dataToValidate = {
        ...data,
        slug: slugify(data.title, { randomSuffix: true }),
    }

    const validatedData = adCreateSchema.safeParse(dataToValidate)

    if (!validatedData.success) throw createError({ statusCode: 400, statusMessage: validatedData.error.message })

    const dataToInsert = {
        ...validatedData.data,
        userId: authSession.user.id,
        businessId,
    }

    // Insert ad
    const insertedData = await createAd(dataToInsert)

    console.log({ insertedData })

    return insertedData
})
