import { categoryCreateSchema } from '~~/schemas/zod'
import { createCategory } from '~~/server/services/category'
import type { IUser } from '~~/types'

export default defineEventHandler(async (event) => {
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    const data = JSON.parse(await readBody(event))

    const dataToValidate = {
        ...data,
        businessId: (authSession.user as IUser).businessId,
        slug: data.slug || slugify(data.name, { randomSuffix: true })
    }

    const validatedData = categoryCreateSchema.safeParse(dataToValidate)
    if (!validatedData.success) throw createError({ statusCode: 400, message: validatedData.error.message })

    const createdData = await createCategory(validatedData.data)

    console.log({ createdData })

    return createdData
})
