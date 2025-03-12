import { getAdById } from '~~/server/services/ad'

export default defineEventHandler(async (event) => {
    // Check if user is authenticated
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    // Get resource ID from URL
    const resourceId = getRouterParam(event, 'id')

    // Check if business ID is valid
    if (!resourceId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Resource not found'
        })
    }


    /* TODO: Implement access control logic here */

    // Check if user has access to this resource
    // Should be superadmin or admin or the user itself
    // const hasAccess = (authSession.user as IUser).role === 'superadmin' || (authSession.user as IUser).role === 'admin' || (authSession.user as IUser).id === userId

    // If user does not have access, throw error
    // if (!hasAccess) {
    //     throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    // }

    // Get user
    const foundData = await getAdById(resourceId)

    // If user not found, throw error
    if (!foundData) throw createError({ statusCode: 404, statusMessage: 'Resource not found' })

    return foundData
})