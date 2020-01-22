import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  collections: {},
  channels: {},
  channelsId: [],
  error: false,
  cursor: '',
  loading: false
})

export const mutations = {
  addCollection (state, payload) {
    state.collections[payload.channelId] = payload.collection
  },
  emptyCollections (state) {
    state.collections = {}
  },
  addChannel (state, channel) {
    state.channels[channel.id] = channel
    state.channelsId.push(channel.id)
  },
  emptyChannels (state) {
    state.channels = {}
    state.channelsId = []
  },
  addError (state, error) {
    state.error = error
  },
  emptyError (state) {
    state.error = false
  },
  setCursor (state, payload) {
    state.cursor = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  }
}
export const actions = {
  async loadVideos ({ commit }, payload) {
    commit('setLoading', true)
    try {
      const res = await axios.get('/.netlify/functions/videos?channel=' + payload, { responseType: 'json' })
      for (const video of res.data.videos) {
        video.duration = moment.duration(durationParser(video.duration))
        video.created_at = moment(video.created_at)
        video.ended_at = moment(video.created_at).add(video.duration)
      }
      commit('addChannel', res.data.channel)
      commit('addCollection', { channelId: res.data.channel.id, collection: res.data.videos })
      commit('setLoading', false)
      commit('setCursor', res.data.cursor)
    } catch (error) {
      commit('setLoading', false)
      commit('addError', error)
    }
  },
  emptyCollections ({ commit }) {
    commit('emptyCollections')
  },
  emptyChannels ({ commit }) {
    commit('emptyChannels')
  },
  emptyError ({ commit }) {
    commit('emptyError')
  },
  setCursor ({ commit }, payload) {
    commit('setCursor', payload)
  }
}

export const getters = {
  channels: state => state.channelsId.map((channelId) => {
    return { ...state.channels[channelId], collection: state.collections[channelId] }
  }),
  error: (state) => {
    return state.error
  },
  cursor: (state) => {
    return state.cursor
  },
  loading: (state) => {
    return state.loading
  }
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
