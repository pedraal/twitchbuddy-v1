export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'token')
  if (!token)
    return null
  const user = await useTwitchApi(token).getUser()

  return { user }
})
