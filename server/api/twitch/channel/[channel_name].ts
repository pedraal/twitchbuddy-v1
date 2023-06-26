export default defineEventHandler(async (event) => {
  if (!event.context.params?.channel_name)
    throw createError({ statusCode: 400, statusMessage: 'Missing channel name' })

  const user = await useTwitchApi(event.context.accessToken).getUser(event.context.params.channel_name)

  return user
})
