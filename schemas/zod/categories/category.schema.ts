import { z } from 'zod'
import { validators } from '../common'


export const categorySchema = z.object({
    id: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }),
    businessId: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }),
    name: z.string(),
    slug: z.string(),
    parentId: z.string().nullish(),
    createdAt: z.number(),
    updatedAt: z.number(),
    deletedAt: z.number().nullish(),
})

export type CategorySchema = z.infer<typeof categorySchema>

// Partial schema for updates
export const categoryUpdateSchema = categorySchema.partial()
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
    })

export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>

// Schema for creating new users
export const categoryCreateSchema = categorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export type CategoryCreateSchema = z.infer<typeof categoryCreateSchema>

