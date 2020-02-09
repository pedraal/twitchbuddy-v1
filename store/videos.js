import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  collections: [],
  selectedVideo: null,
  selectedVideoTimestamp: 0,
  error: false,
  cursor: '',
  loading: false
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
  setCursor (state, payload) {
    state.cursor = payload
  },
  setLoading (state, payload) {
    state.loading = payload
  },
  setSelected (state, payload) {
    state.selectedVideo = payload
  },
  setSelectedVideoTimestamp (state, payload) {
    state.selectedVideoTimestamp = payload
  }
}
export const actions = {
  async getCollections ({ commit }, payload) {
    commit('setLoading', true)
    try {
      const res = await axios.get('/.netlify/functions/videos?channel=' + payload, { responseType: 'json' })
      res.data.forEach(collection => commit('addCollection', collection))
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
  },
  setSelected ({ commit }, payload) {
    commit('setSelected', payload)
  },
  setSelectedVideoTimestamp ({ commit }, payload) {
    commit('setSelectedVideoTimestamp', payload)
  }
}

export const getters = {
  collections: (state) => {
    if (state.selectedVideo) {
      return state.collections.map((collection) => {
        return {
          ...collection,
          collection: collection.collection.filter(video => moment(video.created_at).isBetween(moment(state.selectedVideo.created_at), moment(state.selectedVideo.ended_at), null, []) ||
            moment(video.ended_at).isBetween(moment(state.selectedVideo.created_at), moment(state.selectedVideo.ended_at), null, []) ||
            moment(state.selectedVideo.created_at).isBetween(moment(video.created_at), moment(video.ended_at), null, []) ||
            moment(state.selectedVideo.ended_at).isBetween(moment(video.created_at), moment(video.ended_at), null, []))
        }
      })
    }
    return state.collections
  },
  selectedVideo: (state) => {
    return state.selectedVideo
  },
  selectedVideoTimestamp: (state) => {
    return state.selectedVideoTimestamp
  },
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
