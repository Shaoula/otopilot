import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import type { businesses, businessUsers, users, categories, ads } from '~~/server/database/schema'

// User types
export type IUser = InferSelectModel<typeof users>
export type INewUser = InferInsertModel<typeof users>

// Business types
export type IBusiness = InferSelectModel<typeof businesses>
export type INewBusiness = InferInsertModel<typeof businesses>
export type IBusinessUser = InferSelectModel<typeof businessUsers>
export type INewBusinessUser = InferInsertModel<typeof businessUsers>

// Category types
export type ICategory = InferSelectModel<typeof categories>
export type INewCategory = InferInsertModel<typeof categories>

// Ad types
export type IAd = InferSelectModel<typeof ads>
export type INewAd = InferInsertModel<typeof ads>

