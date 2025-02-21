import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { generateId } from '../utils/id'

export const users = sqliteTable('user', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    name: text('name').notNull(),
    email: text('email').unique().notNull(),
    emailVerified: integer('emailVerified', { mode: 'boolean' }),
    image: text('image'),
    role: text('role').default('user'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
})

export const businesses = sqliteTable('business', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone'),
    address: text('address'),
    logo: text('logo'),
    timezone: text('timezone').notNull().default('UTC'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
})

export const businessUsers = sqliteTable('businessUser', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    businessId: text('businessId').references(() => businesses.id).notNull(),
    userId: text('userId').references(() => users.id).notNull(),
    role: text('role', { enum: ['owner', 'editor'] }).notNull().default('editor'),
    isActive: integer('isActive', { mode: 'boolean' }).notNull().default(true),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
})

export const businessUserRelations = relations(businessUsers, ({ one }) => ({
    business: one(businesses, {
        fields: [businessUsers.businessId],
        references: [businesses.id]
    }),
    user: one(users, {
        fields: [businessUsers.userId],
        references: [users.id]
    })
}))

export const ads = sqliteTable('ads', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => generateId()),
    businessId: text('businessId').references(() => businesses.id).notNull(),
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
    transmission: text('transmission', { enum: ['manual', 'automatic'] }).default('manual'),
    createdAt: integer('createdAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).$defaultFn(() => new Date()),
    deletedAt: integer('deletedAt', { mode: 'timestamp_ms' }),
    isActive: integer('isActive', { mode: 'boolean' }).default(true),
    isFeatured: integer('isFeatured', { mode: 'boolean' }).default(false),
    status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
    userId: text('userId').references(() => users.id).notNull(),
    categoryId: text('categoryId').references(() => categories.id),
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