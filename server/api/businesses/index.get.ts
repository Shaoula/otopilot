import { listBusinesses } from '~~/server/services/business'

export default defineCachedEventHandler(async (_event) => {
    const authSession = await getAuthSession(_event)

    if (!authSession) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'You are not authorized to access this resource',
        })
    }

    return await listBusinesses()
})