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
  const channels = params.channel.split(',')
  try {
    const { data: broadcaster } = await twitch.get('/users?login=' + channels.join('&login='))
    if (broadcaster.data.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify('channel not found')
      }
    }

    const collections = await Promise.all(
      broadcaster.data.map(async (channel) => {
        channel.collection = await getVideos(channel.id, params)
        return channel
      })
    )

    return {
      statusCode: 200,
      body: JSON.stringify(collections)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.msg)
    }
  }
}

const getVideos = async function (id, params) {
  const videos = await twitch.get('/videos?first=100&user_id=' + id + parametize(params))
  return videos.data.data
}

const parametize = function (params) {
  let url = ''
  if (params.cursor) {
    url = url + '&after=' + params.cursor
  }
  if (params.start && params.end) {
    url = url + '&started_at=' + params.start + '&ended_at=' + params.end
  }
  return url
}
