const axios = require('axios')

const twitch = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    common: {
      Accept: 'application/vnd.twitchtv.v5+json',
      'Client-ID': process.env.TWITCH_TOKEN
    }
  }
})

exports.handler = async (event, context, callback) => {
  const params = event.queryStringParameters
  try {
    const { data: broadcaster } = await twitch.get('/users?login=' + params.channel)
    if (broadcaster.data.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify('channel not found')
      }
    }

    let url = '/videos?first=100&user_id=' + broadcaster.data[0].id
    if (params.cursor) {
      url = url + '&after=' + params.cursor
    }
    if (params.start && params.end) {
      url = url + '&started_at=' + params.start + '&ended_at=' + params.end
    }

    const { data: videos } = await twitch.get(url)
    if (videos.data.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify('videos not found')
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ clips: videos.data, cursor: videos.pagination.cursor })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.msg)
    }
  }
}
