import type { ICategory, INewCategory } from '~~/types'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { consola } from 'consola'

export async function listCategories(): Promise<ICategory[]> {
    return await useDrizzle()
        .select()
        .from(tables.categories)
        .where(isNull(tables.categories.deletedAt))
        .orderBy(desc(tables.categories.createdAt))
}

export async function getCategoryById(id: string): Promise<ICategory | undefined> {
    return await useDrizzle()
        .select()
        .from(tables.categories)
        .where(
            and(
                eq(tables.categories.id, id),
                isNull(tables.categories.deletedAt),
            ),
        )
        .get()
}

export async function createCategory(data: INewCategory): Promise<ICategory | null> {
    try {
        const [result] = await useDrizzle()
            .insert(tables.categories)
            .values(data)
            .returning()

        return result
    }
    catch (error) {
        consola.error(error)
        return null
    }
}

export async function updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    try {
        const [result] = await useDrizzle()
            .update(tables.categories)
            .set(data)
            .where(eq(tables.categories.id, id))
            .returning()

        return result
    }
    catch (error) {
        consola.error(error)
        return null
    }
}

export async function deleteCategory(id: string): Promise<boolean> {
    try {
        await useDrizzle()
            .update(tables.categories)
            .set({ deletedAt: new Date() })
            .where(eq(tables.categories.id, id))

        return true
    }
    catch (error) {
        consola.error(error)
        return false
    }
}
