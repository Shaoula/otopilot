import { z } from 'zod'
import { validators } from '../common'

export const adSchema = z.object({
    id: z.string().refine(validators.isUUID, { message: 'Invalid UUID' }), // UUID but like: 5y-qX2Mmm8lZWJ3HOPU4r
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    price: z.number(),
    make: z.string(),
    model: z.string(),
    color: z.string().nullish(),
    year: z.number().nullish(),
    mileage: z.number().nullish(),
    fuelType: z.string().nullish(),
    gearType: z.string().nullish(),
    bodyType: z.string().nullish(),
    engineCapacity: z.number().nullish(),
    enginePower: z.number().nullish(),
    doors: z.number().nullish(),
    seats: z.number().nullish(),
    transmission: z.enum(['manual', 'automatic']).nullish(),
    categoryId: z.string().nullish(),
    userId: z.string().nullish(),
    visuals: z.array(z.string()).nullish(),
    features: z.array(z.string()).nullish(),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending').nullish(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    createdAt: z.string(),
    updatedAt: z.string(),
    deletedAt: z.string().nullable(),
})

export type AdSchema = z.infer<typeof adSchema>

// Partial schema for updates
export const adUpdateSchema = adSchema.partial()
    .omit({
        id: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true
    })

export type AdUpdateSchema = z.infer<typeof adUpdateSchema>

// Schema for creating new ads
export const adCreateSchema = adSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    status: true,
    isActive: true,
    isFeatured: true,
})

export type AdCreateSchema = z.infer<typeof adCreateSchema>

