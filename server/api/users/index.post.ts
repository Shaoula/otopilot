import { userCreateSchema } from '~~/schemas/zod'
import { createUser } from '~~/server/services/user'

export default defineEventHandler(async (event) => {
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    const data = JSON.parse(await readBody(event))

    const dataToValidate = {
        ...data,
    }

    const validatedData = userCreateSchema.safeParse(dataToValidate)
    if (!validatedData.success) throw createError({ statusCode: 400, statusMessage: validatedData.error.message })

    const user = await createUser(validatedData.data)

    console.log({ user })

    return user
})
