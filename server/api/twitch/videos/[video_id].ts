export default defineEventHandler(async (event) => {
  if (!event.context.params?.video_id)
    throw createError({ statusCode: 400, statusMessage: 'Missing video id' })

  const video = await useTwitchApi(event.context.accessToken).getVideo(event.context.params.video_id)

  return video
})
