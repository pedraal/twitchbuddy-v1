export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const state = getCookie(event, 'state')
  if (!state || state !== query.state)
    return sendRedirect(event, '/?login=failed')

  deleteCookie(event, 'state')

  const { safeQueryParamString } = useQueryParamsHelpers()
  const { callback } = useTwitchAuth()
  const { access_token, expires_in, refresh_token } = await callback(safeQueryParamString(query.code))

  setCookie(event, 'accessToken', access_token, { maxAge: expires_in, httpOnly: true })
  setCookie(event, 'refreshToken', refresh_token, { httpOnly: true })

  return sendRedirect(event, '/')
})
