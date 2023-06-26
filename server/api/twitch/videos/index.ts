export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (!query.channelId)
    throw createError({ statusCode: 400, statusMessage: 'Missing channelId' })

  const { safeQueryParamString } = useQueryParamsHelpers()

  const response = await useTwitchApi(event.context.accessToken).getVideos(safeQueryParamString(query.channelId), { cursor: safeQueryParamString(query.cursor) })

  return response
})
