import { getAdBySlug } from '~~/server/services/ads'
import { verifyBusinessAccess } from '~~/server/services/businessUser'

export default defineCachedEventHandler(async (event) => {
    // Get auth session
    const authSession = await getAuthSession(event)

    // Check if user is authenticated
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Get business ID from URL
    const businessId = getRouterParam(event, 'businessId')
    if (!businessId) throw createError({ statusCode: 404, statusMessage: 'Business ID not found' })

    // Check if user has access to business
    const hasAccess = await verifyBusinessAccess(authSession.user, businessId)
    if (!hasAccess) throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })

    // Get ad slug from URL
    const adSlug = getRouterParam(event, 'adSlug')
    if (!adSlug) throw createError({ statusCode: 404, statusMessage: 'Ad not found' })

    // Get ad by slug
    const foundData = await getAdBySlug(adSlug)

    if (!foundData) throw createError({ statusCode: 404, statusMessage: 'Ad not found' })

    return foundData
})