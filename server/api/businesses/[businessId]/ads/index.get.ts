import { getAdsByBusinessId } from '~~/server/services/ad'
// import { verifyBusinessAccess } from '~~/server/services/businessUser'

export default defineCachedEventHandler(async (_event) => {
    /* // Get auth session
    const authSession = await getAuthSession(_event)

    // Check if user is authenticated
    if (!authSession) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        })
    } */

    // Get business ID from URL
    const businessId = getRouterParam(_event, 'businessId')

    // Check if business ID is valid
    if (!businessId) {
        throw createError({ statusCode: 404, statusMessage: 'Business ID not found' })
    }

    /* // Check if user has access to business
    const hasAccess = await verifyBusinessAccess(authSession.user, businessId)
    if (!hasAccess) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    } */

    // Get ads for business
    const ads = await getAdsByBusinessId(businessId)

    return ads
})