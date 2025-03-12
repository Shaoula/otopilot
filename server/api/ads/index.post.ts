import { adCreateSchema } from '~~/schemas/zod'
import { createAd } from '~~/server/services/ad'
import type { IUser } from '~~/types'

export default defineEventHandler(async (event) => {
    const authSession = await getAuthSession(event)
    if (!authSession?.user?.id) throw createError({ statusCode: 401, statusMessage: 'Unauthorized', message: 'You are not authorized to access this resource' })

    const isAdmin = (authSession.user as IUser).role === 'admin' || (authSession.user as IUser).role === 'superadmin'

    const data = JSON.parse(await readBody(event))

    const dataToValidate = {
        ...data,
        slug: data.slug || slugify(data.title, { randomSuffix: true }),
        userId: (authSession.user as IUser).id ?? null,
        businessId: data.businessId && isAdmin ? data.businessId : (authSession.user as IUser).businessId,
    }

    const validatedData = adCreateSchema.safeParse(dataToValidate)
    if (!validatedData.success) throw createError({ statusCode: 400, message: validatedData.error.message })

    const createdData = await createAd(validatedData.data)

    console.log({ createdData })

    return createdData
})
