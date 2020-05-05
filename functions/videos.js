const axios = require('axios')
const moment = require('moment')

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
    const broadcaster = await twitch.get('/users?login=' + channels.join('&login='))
    const collections = await Promise.all(
      broadcaster.data.data.map(async (channel) => {
        channel.videos = await getVideos(channel.id, params)
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
  const videos = await twitch.get('/videos?first=100&type=all&user_id=' + id + parametize(params))
  const buffer = videos.data.data.map((video) => {
    return {
      ...video,
      ended_at: moment(moment(video.created_at).add(moment.duration(durationParser(video.duration)))).toISOString()
    }
  })
  return buffer
}

const durationParser = (val) => {
  const obj = {
    hours: '',
    minutes: '',
    seconds: ''
  }
  for (let i = 0; i < val.length; i++) {
    if (i < val.indexOf('h')) {
      obj.hours = obj.hours + val[i]
    } else if (i > val.indexOf('h') && i < val.indexOf('m')) {
      obj.minutes = obj.minutes + val[i]
    } else if (i > val.indexOf('m') && i < val.indexOf('s')) {
      obj.seconds = obj.seconds + val[i]
    } else {
    }
  }
  return obj
}

const parametize = function (params) {
  let url = ''
  if (params.cursor) {
    url = url + '&after=' + params.cursor
  }
  return url
}
