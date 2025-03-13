export default defineEventHandler(async (event) => {
  // Skip domain check when running in dev mode
  if (process.env.NODE_ENV === 'development') {
    return
  }

  // Skip domain check for non-API routes
  if (!event.path.startsWith('/api/') || event.path.startsWith('/api/auth')) {
    return
  }

  const config = useRuntimeConfig()
  const allowedDomains = config.allowedDomains

  const origin = event.headers.get('origin') || event.headers.get('referer')
  if (!origin) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Origin header is required',
      message: 'Origin header is required',
    })
  }

  try {
    const domain = new URL(origin).hostname
    console.log('domain', domain)
    console.log('allowedDomains', allowedDomains)
    if (!allowedDomains.includes(domain)) {
      throw createError({
        statusCode: 403,
        message: 'Domain not authorized',
      })
    }
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Invalid origin',
      cause: error,
    })
  }
}) 