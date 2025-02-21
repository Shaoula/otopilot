import { z } from 'zod'
import { validators } from '../common'


export const businessSchema = z.object({
    id: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().nullish(),
    address: z.string().nullish(),
    logo: z.string().nullish(),
    timezone: z.string().default('UTC'),
    createdAt: z.number(),
    updatedAt: z.number(),
    deletedAt: z.number().nullish(),
})

export type BusinessSchema = z.infer<typeof businessSchema>

// Partial schema for updates
export const businessUpdateSchema = businessSchema.partial()
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
    })

export type BusinessUpdateSchema = z.infer<typeof businessUpdateSchema>

// Schema for creating new ads
export const businessCreateSchema = businessSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export type BusinessCreateSchema = z.infer<typeof businessCreateSchema>

