import { drizzle } from 'drizzle-orm/d1'

import * as schemas from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export const tables = schemas

export function useDrizzle() {
    return drizzle(hubDatabase(), { schema: schemas })
}

export type IAd = typeof schemas.ads.$inferSelect
