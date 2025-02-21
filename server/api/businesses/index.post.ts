import { businessCreateSchema } from '~~/schemas/zod'
import { createBusiness } from '~~/server/services/business'

export default defineEventHandler(async (event) => {
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    const data = JSON.parse(await readBody(event))

    const dataToValidate = {
        ...data,
    }

    const validatedData = businessCreateSchema.safeParse(dataToValidate)
    if (!validatedData.success) throw createError({ statusCode: 400, statusMessage: validatedData.error.message })

    const business = await createBusiness(validatedData.data)

    console.log({ business })

    return business
})
