export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refreshToken')
  if (!refreshToken)
    throw createError({ statusMessage: 'Unauthorized', statusCode: 401 })

  const query = getQuery(event)
  const { safeQueryParamString } = useQueryParamsHelpers()
  const { refreshAccessToken } = useTwitchAuth()
  const { access_token, expires_in, refresh_token } = await refreshAccessToken(refreshToken)

  setCookie(event, 'accessToken', access_token, { maxAge: expires_in, httpOnly: true })
  setCookie(event, 'refreshToken', refresh_token, { httpOnly: true })

  return sendRedirect(event, safeQueryParamString(query.redirect_uri) || '/')
})
