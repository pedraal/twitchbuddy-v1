export default defineEventHandler(async (event) => {
  if (!event.context.accessToken)
    return null
  const user = await useTwitchApi(event.context.accessToken).getUser()

  return user
})
