import { updateUser  } from "~~/server/services/user"
import { userUpdateSchema } from "~~/schemas/zod"
import type { IUser } from "~~/types"

export default defineEventHandler(async (event) => {
    // Check if user is authenticated
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    // Get user ID from URL
    const userId = getRouterParam(event, 'id')

    // Check if user ID is valid
    if (!userId) {
        throw createError({ statusCode: 404, statusMessage: 'User ID not found' })
    }

    // Check if user has access to user
    const hasAccess = (authSession.user as IUser).role === 'superadmin' || (authSession.user as IUser).role === 'admin' || (authSession.user as IUser).id === userId
    if (!hasAccess) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden', message: 'You are not authorized to access this resource' })
    }

    // Get data from request
    const data = JSON.parse(await readBody(event))

    // Validate data
    const validatedData = userUpdateSchema.safeParse(data)
    if (!validatedData.success) throw createError({ statusCode: 400, statusMessage: validatedData.error.message })

    // Update user
    const updatedUser = await updateUser(userId, validatedData.data)

    return updatedUser
})
