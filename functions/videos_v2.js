const { TwitchApi } = require('../utils/twitch-api')

exports.handler = async (event, context, callback) => {
  try {
    const api = new TwitchApi(process.env.TWITCH_TOKEN, process.env.TWITCH_SECRET)
    await api.setupAxios()

    const params = event.queryStringParameters
    const channels = params.channels.split(',')
    const broadcasters = await api.getChannelId(channels)
    const collections = await Promise.all(
      broadcasters.map(async (channel) => {
        const { data: replays } = await api.getReplays(channel.id)
        channel.videos = replays
        return channel
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify(collections)
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    }
  }
}
