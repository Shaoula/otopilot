import type { UserWithRole } from 'better-auth/plugins'
import type { IBusinessUser } from '~~/types'
import { and, desc, eq } from 'drizzle-orm'

export async function getBusinessUserByUserId(userId: string) {
  return await useDrizzle()
    .select()
    .from(tables.businessUsers)
    .where(eq(tables.businessUsers.userId, userId))
    .get()
}

export async function addUserToBusiness(userId: string, businessId: string, role: IBusinessUser['role']) {
  // Check if user is already in business
  const isUserInBusiness = await useDrizzle()
    .select()
    .from(tables.businessUsers)
    .where(
      and(
        eq(tables.businessUsers.userId, userId),
        eq(tables.businessUsers.businessId, businessId),
      ),
    )

  if (isUserInBusiness) return isUserInBusiness


  return await useDrizzle()
    .insert(tables.businessUsers)
    .values({ userId, businessId, role })
}

export async function updateBusinessUser(id: string, data: Partial<IBusinessUser>) {
  return await useDrizzle()
    .update(tables.businessUsers)
    .set(data)
    .where(eq(tables.businessUsers.id, id))
}

export async function deleteBusinessUser(id: string) {
  return await useDrizzle()
    .delete(tables.businessUsers)
    .where(eq(tables.businessUsers.id, id))
}

export async function verifyBusinessAccess(user: UserWithRole, businessId: string) {
  if (user.role === 'superadmin' || user.role === 'admin') {
    return true
  }

  return await useDrizzle()
    .select()
    .from(tables.businessUsers)
    .where(
      and(
        eq(tables.businessUsers.userId, user.id),
        eq(tables.businessUsers.businessId, businessId),
      ),
    )
    .get()
}

export async function getBusinessUsers(businessId: string) {
  // return await useDrizzle()
  //   .select()
  //   .from(businessUsers)
  //   .where(eq(businessUsers.businessId, businessId))
  //   .leftJoin(users, eq(businessUsers.userId, users.id))

  // Only return user data
  const businessUsersList = await useDrizzle()
    .query.businessUsers.findMany({
      with: {
        user: true,
      },
      where: eq(tables.businessUsers.businessId, businessId),
      orderBy: desc(tables.businessUsers.createdAt),
    })


  return businessUsersList.map(businessUser => (businessUser.user))
}
