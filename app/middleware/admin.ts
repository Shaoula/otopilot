import type { UserWithRole } from 'better-auth/plugins'

export default defineNuxtRouteMiddleware(async (to) => {
  // Only check admin routes
  if (!to.path.startsWith('/admin'))
    return

  const { user } = useAuth()

  // Check if user is admin
  if ((user.value as UserWithRole)?.role !== 'admin' && (user.value as UserWithRole)?.role !== 'superadmin') {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }
})
