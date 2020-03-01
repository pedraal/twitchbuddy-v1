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

    let url = '/clips?first=100&broadcaster_id=' + broadcaster.data[0].id
    if (params.cursor) {
      url = url + '&after=' + params.cursor
    }
    if (params.start && params.end) {
      url = url + '&started_at=' + params.start + '&ended_at=' + params.end
    }

    const { data: clips } = await twitch.get(url)
    if (clips.data.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify('clips not found')
      }
    }

    let gamesId = ''
    for (const clip of clips.data) {
      gamesId = gamesId + 'id=' + clip.game_id + '&'
      clip.downloadLink = clip.thumbnail_url.substr(0, clip.thumbnail_url.indexOf('-preview-')) + '.mp4'
    }
    const { data: games } = await twitch.get(`/games?${gamesId}`)
    if (games.data.length > 0) {
      for (const clip of clips.data) {
        const categoryObj = games.data.filter(game => game.id === clip.game_id)[0]
        clip.category = categoryObj ? categoryObj.name : ''
        clip.downloadLink = clip.thumbnail_url.substr(0, clip.thumbnail_url.indexOf('-preview-')) + '.mp4'
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ clips: clips.data, cursor: clips.pagination.cursor })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.msg)
    }
  }
}
