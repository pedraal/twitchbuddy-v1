export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/twitch'))
    return

  const accessToken = getCookie(event, 'accessToken')
  const refreshToken = getCookie(event, 'refreshToken')
  // Prevent being disconnected will using the app, a proper refresh should be performed by using the /api/auth/refresh endpoint
  if (!accessToken && refreshToken) {
    const { refreshAccessToken } = useTwitchAuth()
    const { access_token } = await refreshAccessToken(refreshToken)

    event.context.accessToken = access_token
  }
  // We don't want to raise an error if we are requesting a not logged in user
  else if (!accessToken && event.node.req.url === '/api/twitch/me') {
    event.context.accessToken = null
  }
  else if (!accessToken) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }

  event.context.accessToken ||= accessToken
})
