import type { IAd, INewAd } from '~~/types'
import { and, desc, eq, isNull } from 'drizzle-orm'
import { consola } from 'consola'

export async function listAds(): Promise<IAd[]> {
  return await useDrizzle()
    .select()
    .from(tables.ads)
    .where(isNull(tables.ads.deletedAt))
    .orderBy(desc(tables.ads.createdAt))
}

export async function getAdsByBusinessId(businessId?: string): Promise<IAd[]> {
    return await useDrizzle()
        .select()
        .from(tables.ads)
        .where(
            and(
                isNull(tables.ads.deletedAt),
                businessId ? eq(tables.ads.businessId, businessId) : undefined,
            )
        )
        .orderBy(desc(tables.ads.createdAt))
}

export async function getAdById(id: string): Promise<IAd | undefined> {
  return await useDrizzle()
    .select()
    .from(tables.ads)
    .where(
      and(
        eq(tables.ads.id, id),
        isNull(tables.ads.deletedAt),
      ),
    )
    .get()
}

export async function getAdBySlug(slug: string): Promise<IAd | undefined> {
  const result = await useDrizzle()
    .select()
    .from(tables.ads)
    .where(
      and(
        eq(tables.ads.slug, slug),
        isNull(tables.ads.deletedAt),
      ),
    )
    .get()

  return result
}


export async function createAd(data: INewAd): Promise<IAd | null> {
  try {
    const [result] = await useDrizzle()
      .insert(tables.ads)
      .values(data)
      .returning()

    return result
  } catch (error) {
    consola.error(error)
    return null
  }
}

export async function updateAd(id: string, data: Partial<IAd>): Promise<IAd | null> {
  try {
    const updateData = {
      ...data,
      updatedAt: new Date(),
  }

  const [result] = await useDrizzle()
    .update(tables.ads)
    .set(updateData)
    .where(
      and(
        eq(tables.ads.id, id),
        isNull(tables.ads.deletedAt),
      ),
    )
    .returning()

    return result
  } catch (error) {
    consola.error(error)
    return null
  }
}

export async function deleteAd(id: string): Promise<boolean> {
  try {
    await useDrizzle()
      .update(tables.ads)
      .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tables.ads.id, id),
        isNull(tables.ads.deletedAt),
      ),
    )

    return true
  } catch (error) {
    consola.error(error)
    return false
  }
}
