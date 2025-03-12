import { updateAd } from "~~/server/services/ad"
import { adUpdateSchema } from "~~/schemas/zod"

export default defineEventHandler(async (event) => {
    // Check if user is authenticated
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    // Get resource ID from URL
    const resourceId = getRouterParam(event, 'id')

    // Check if user ID is valid
    if (!resourceId) {
        throw createError({ statusCode: 404, statusMessage: 'Resource not found' })
    }

    /* TODO: Implement access control logic here */

    // Check if user has access to user
    // const hasAccess = (authSession.user as IUser).role === 'superadmin' || (authSession.user as IUser).role === 'admin' || (authSession.user as IUser).id === userId
    // if (!hasAccess) {
    //     throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    // }

    // Get data from request
    const data = JSON.parse(await readBody(event))

    // Validate data
    const validatedData = adUpdateSchema.safeParse(data)
    if (!validatedData.success) throw createError({ statusCode: 400, statusMessage: validatedData.error.message })

    // Update user
    const updatedUser = await updateAd(resourceId, validatedData.data)

    return updatedUser
})
