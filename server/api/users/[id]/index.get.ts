import { getUserById } from '~~/server/services/user'
import type { IUser } from '~~/types'

export default defineEventHandler(async (event) => {
    // Check if user is authenticated
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    // Get business ID from URL
    const userId = getRouterParam(event, 'id')

    // Check if business ID is valid
    if (!userId) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User ID not found'
        })
    }

    // Check if user has access to user
    // Should be superadmin or admin or the user itself
    const hasAccess = (authSession.user as IUser).role === 'superadmin' || (authSession.user as IUser).role === 'admin' || (authSession.user as IUser).id === userId

    // If user does not have access, throw error
    if (!hasAccess) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    }

    // Get user
    const foundData = await getUserById(userId)

    // If user not found, throw error
    if (!foundData) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    return foundData
})