import type { INewUser, IUser } from '~~/types'
import { consola } from 'consola'
import { and, eq, isNull } from 'drizzle-orm'
import { users } from '~~/server/database/schema'

export async function listUsers() {
  return await useDrizzle()
    .select()
    .from(users)
    .where(isNull(users.deletedAt))
}

export async function getUserById(id: string) {
  return await useDrizzle()
    .select()
    .from(users)
    .where(
      and(
        eq(users.id, id),
        isNull(users.deletedAt),
      ),
    )
    .get()
}

export async function getUserByEmail(email: string) {
  return await useDrizzle()
    .select()
    .from(users)
    .where(
      and(
        eq(users.email, email),
        isNull(users.deletedAt),
      ),
    )
    .get()
}

export async function createUser(data: INewUser) {
  try {
    return await useDrizzle()
      .insert(users)
      .values(data)
      .returning()
  }
  catch (error) {
    consola.error(error)
  }
}

export async function updateUser(userId: string, data: Partial<IUser>) {
  return await useDrizzle()
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(users.id, userId),
        isNull(users.deletedAt),
      ),
    )
    .returning()
}

export async function deleteUser(email: string) {
  return await useDrizzle()
    .update(users)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(users.email, email),
        isNull(users.deletedAt),
      ),
    )
    .returning()
}
