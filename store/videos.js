import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  collections: [],
  selectedVideo: { },
  selectedVideoTimestamp: 0,
  error: false
})

export const mutations = {
  addCollection (state, collection) {
    state.collections.push(collection)
  },
  emptyCollections (state) {
    state.collections = []
  },
  addError (state, error) {
    state.error = error
  },
  emptyError (state) {
    state.error = false
  },
  setSelected (state, payload) {
    state.selectedVideo = payload
  }
}
export const actions = {
  async getCollections ({ commit }, payload) {
    commit('global/setLoading', true, { root: true })
    try {
      const res = await axios.get('/.netlify/functions/videos?channel=' + payload, { responseType: 'json' })
      res.data.forEach(collection => commit('addCollection', collection))
      commit('global/setLoading', false, { root: true })
    } catch (error) {
      commit('global/setLoading', false, { root: true })
      commit('addError', error)
    }
  },
  emptyCollections ({ commit }) {
    commit('emptyCollections')
  },
  emptyError ({ commit }) {
    commit('emptyError')
  },
  setSelected ({ commit }, payload) {
    commit('setSelected', payload)
  }
}

export const getters = {
  collections: (state) => {
    if (state.selectedVideo) {
      return state.collections.map((collection) => {
        return {
          ...collection,
          videos: collection.videos.filter(
            video => moment(video.created_at).isBetween(moment(state.selectedVideo.created_at),
              moment(state.selectedVideo.ended_at),
              null,
              []) ||
            moment(video.ended_at).isBetween(
              moment(state.selectedVideo.created_at),
              moment(state.selectedVideo.ended_at),
              null,
              []) ||
            moment(state.selectedVideo.created_at).isBetween(
              moment(video.created_at),
              moment(video.ended_at),
              null,
              []) ||
            moment(state.selectedVideo.ended_at).isBetween(moment(video.created_at),
              moment(video.ended_at),
              null,
              []))
        }
      })
    }
    return state.collections
  },
  selectedVideo: (state) => {
    return state.selectedVideo
  },
  error: (state) => {
    return state.error
  }
}
