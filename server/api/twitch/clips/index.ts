export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (!query.channelId)
    throw createError({ statusCode: 400, statusMessage: 'Missing channelId' })

  const { safeQueryParamString } = useQueryParamsHelpers()

  const response = await useTwitchApi(event.context.accessToken).getClips(
    safeQueryParamString(query.channelId),
    {
      started_at: safeQueryParamString(query.started_at),
      ended_at: safeQueryParamString(query.ended_at),
    },
  )

  const gameIds = response.data.map(clip => clip.game_id)
  const games = await useTwitchApi(event.context.accessToken).getGames(gameIds)

  response.data.forEach((clip) => {
    const game = games.find(game => game.id === clip.game_id)
    clip.game_name = game?.name
  })

  return response
})
