import { z } from 'zod'
import { validators } from '../common'


export const userSchema = z.object({
    id: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }),
    businessId: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }),
    name: z.string(),
    email: z.string().email(),
    emailVerified: z.boolean().default(false),
    image: z.string().nullish(),
    role: z.string().default('user'),
    banned: z.boolean().default(false).nullish(),
    banReason: z.string().nullish(),
    banExpires: z.number().nullish(),
    createdAt: z.number(),
    updatedAt: z.number(),
    deletedAt: z.number().nullish(),
})

export type UserSchema = z.infer<typeof userSchema>

// Partial schema for updates
export const userUpdateSchema = userSchema.partial()
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
    })

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>

// Schema for creating new users
export const userCreateSchema = userSchema.omit({
    id: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
})

export type UserCreateSchema = z.infer<typeof userCreateSchema>

