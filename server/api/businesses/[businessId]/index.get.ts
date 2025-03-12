import { getBusinessById } from '~~/server/services/business'
import { verifyBusinessAccess } from '~~/server/services/businessUser'

export default defineEventHandler(async (event) => {
    // Check if user is authenticated
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    // Get business ID from URL
    const businessId = getRouterParam(event, 'businessId')

    // Check if business ID is valid
    if (!businessId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Business ID not found'
        })
    }

    // Check if user has access to business
    const hasAccess = await verifyBusinessAccess(authSession.user, businessId)

    // If user does not have access, throw error
    if (!hasAccess) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    }

    // Get business
    const foundData = await getBusinessById(businessId)

    // If business not found, throw error
    if (!foundData) throw createError({ statusCode: 404, statusMessage: 'Business not found' })

    return foundData
})