const axios = require('axios')
const moment = require('moment')
const { Sentry } = require('./sentry-service')

const TwitchApi = class TwitchApi {
  constructor (clientId, clientSecret) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async setupAxios () {
    const token = await this.getOauthToken()
    this.axios = axios.create({
      baseURL: 'https://api.twitch.tv/helix/',
      headers: {
        common: {
          Accept: 'application/vnd.twitchtv.v5+json',
          'Client-ID': this.clientId,
          Authorization: token
        }
      }
    })
  }

  async getOauthToken () {
    try {
      const { data } = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`)
      return 'Bearer ' + data.access_token
    } catch (error) {
      Sentry.captureException(error)
      return { error }
    }
  }

  async getAndPrepareClips (params) {
    const channelId = await this.getChannelId(params.channel)
    if (channelId.error) throw channelId.error
    const options = { broadcaster_id: channelId }
    if (params.start) options.started_at = params.start
    if (params.end) options.ended_at = params.end
    if (params.cursor) options.after = params.cursor
    const { data: clips, pagination, error } = await this.getClips(options)
    if (error) throw error
    const games = await this.getGames(clips.map(clip => clip.game_id))
    const data = clips.map((clip) => {
      return {
        ...clip,
        category: games.find(game => game.id === clip.game_id) ? games.find(game => game.id === clip.game_id).name : '',
        downloadLink: clip.thumbnail_url.substr(0, clip.thumbnail_url.indexOf('-preview-')) + '.mp4'
      }
    })

    return { data, pagination }
  }

  async getChannelId (params) {
    try {
      if (typeof params === 'string') {
        const { data: users } = await this.axios.get('/users?login=' + params)
        if (users.data.length === 0) throw new Error('channel-not-found')
        else return users.data[0].id
      } else if (typeof params === 'object') {
        const { data: users } = await this.axios.get('/users?login=' + params.join('&login='))
        return users.data
      }
    } catch (error) {
      Sentry.captureException(error)
      return { error }
    }
  }

  async getClips (params) {
    try {
      let url = '/clips?first=100'
      Object.keys(params).forEach(key => (url = url + `&${key}=${params[key]}`))
      const { data: clips } = await this.axios.get(url)
      return { data: clips.data, pagination: clips.pagination.cursor }
    } catch (error) {
      Sentry.captureException(error)
      return { error }
    }
  }

  async getReplays (channelId) {
    try {
      const url = '/videos?type=archive&user_id=' + channelId
      const { data: replays } = await this.axios.get(url)
      return {
        data: replays.data.map((replay) => {
          return {
            ...replay,
            ended_at: moment(moment(replay.created_at).add(moment.duration(this.durationParser(replay.duration)))).toISOString()
          }
        })
      }
    } catch (error) {
      Sentry.captureException(error)
      return { error }
    }
  }

  async getGames (ids) {
    try {
      const trimedIds = [...new Set(ids)]
      let url = '/games?'
      trimedIds.forEach(id => (url = url + `&id=${id}`))
      const { data: games } = await this.axios.get(url)
      return games.data
    } catch (error) {
      Sentry.captureException(error)
      return { error }
    }
  }

  durationParser (val) {
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
}

module.exports = { TwitchApi }
