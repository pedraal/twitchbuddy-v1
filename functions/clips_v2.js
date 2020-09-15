const { TwitchApi } = require('../utils/twitch-api')

exports.handler = async (event, context, callback) => {
  try {
    const api = new TwitchApi(process.env.TWITCH_TOKEN, process.env.TWITCH_SECRET, process.env.OAUTH_TOKEN)
    await api.setupAxios()

    const params = event.queryStringParameters
    const clips = await api.getAndPrepareClips(params)
    return {
      statusCode: 200,
      body: JSON.stringify(clips)
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    }
  }
}
