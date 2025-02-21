import type { ICategory } from '.'

export interface IAd {
    id: string
    businessId: string
    slug: string
    title: string
    description: string
    price: number | undefined
    images: string[]
    make: string
    model: string
    year: number | undefined
    color: string | undefined
    mileage: number | undefined
    fuelType: string | undefined
    gearType: string | undefined
    bodyType: string | undefined
    engineCapacity: number | undefined
    enginePower: number | undefined
    doors: number | undefined
    seats: number | undefined
    transmission: 'manual' | 'automatic' | undefined
    createdAt: number
    updatedAt: number
    deletedAt: number | undefined
    isActive: boolean
    isFeatured: boolean
    status: 'pending' | 'approved' | 'rejected' | undefined
    userId: string
    categoryId: string | undefined
    category?: ICategory | undefined
    visuals: string[]
    features: string[]
}