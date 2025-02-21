import type { IBusiness, INewBusiness } from '~~/types'
import { consola } from 'consola'
import { and, eq, isNull } from 'drizzle-orm'
import { businesses } from '~~/server/database/schema'

export async function listBusinesses() {
  return await useDrizzle()
    .select()
    .from(businesses)
    .where(isNull(businesses.deletedAt))
}

export async function getBusinessById(id: string) {
  return await useDrizzle()
    .select()
    .from(businesses)
    .where(
      and(
        eq(businesses.id, id),
        isNull(businesses.deletedAt),
      ),
    )
    .get()
}

export async function createBusiness(data: INewBusiness) {
  try {
    const [result] = await useDrizzle()
      .insert(businesses)
      .values(data)
      .returning()

    return result
  }
  catch (error) {
    consola.error(error)
  }
}

export async function updateBusiness(id: string, data: Partial<IBusiness>) {
  const updateData = {
    ...data,
    updatedAt: new Date(),
  }

  const [result] = await useDrizzle()
    .update(businesses)
    .set(updateData)
    .where(
      and(
        eq(businesses.id, id),
        isNull(businesses.deletedAt),
      ),
    )
    .returning()
  return result
}

export async function deleteBusiness(id: string) {
  const [result] = await useDrizzle()
    .update(businesses)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(businesses.id, id),
        isNull(businesses.deletedAt),
      ),
    )
    .returning()

  return result
}
