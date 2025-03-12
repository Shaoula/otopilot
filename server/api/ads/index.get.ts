import { getAdsByBusinessId } from '~~/server/services/ad'
import type { IUser } from '~~/types'

export default defineEventHandler(async (_event) => {
    const authSession = await getAuthSession(_event)
    if (!authSession) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
            message: 'You are not authorized to access this resource',
        })
    }

    const businessId = (authSession.user as IUser).businessId
    if (!businessId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'User does not belong to a business',
        })
    }

    return await getAdsByBusinessId(businessId)
})