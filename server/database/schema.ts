import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { generateId } from '../utils/id'

export const users = sqliteTable('user', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    email: text('email').unique().notNull(),
    emailVerified: integer('emailVerified', { mode: 'boolean' }),
    image: text('image'),
    isAnonymous: integer('isAnonymous', { mode: 'boolean' }),
    role: text('role').default('user'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
})

export const ads = sqliteTable('ads', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    price: real('price'),
    make: text('make').notNull(),
    model: text('model').notNull(),
    color: text('color'),
    year: integer('year'),
    mileage: integer('mileage'),
    fuelType: text('fuelType'),
    gearType: text('gearType'),
    bodyType: text('bodyType'),
    engineCapacity: real('engineCapacity'),
    enginePower: integer('enginePower'),
    doors: integer('doors'),
    seats: integer('seats'),
    driveType: text('driveType'),
    transmission: text('transmission', { enum: ['manual', 'automatic'] }).default('manual'),
    vin: text('vin'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
    isActive: integer('isActive').default(1),
    isFeatured: integer('isFeatured').default(0),
    status: text('status').default('pending'),
    userId: text('userId').notNull(),
    categoryId: text('categoryId'),
    visuals: text('visuals', { mode: 'json' }),
    features: text('features', { mode: 'json' })
})

export const adsRelations = relations(ads, ({ one }) => ({
    user: one(users, {
        fields: [ads.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [ads.categoryId],
        references: [categories.id]
    })
}))

export const categories = sqliteTable('categories', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    parentId: text('parentId'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
})

export const categoriesRelations = relations(categories, ({ one }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id]
    })
}))