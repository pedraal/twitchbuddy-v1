import axios from 'axios'

export const state = () => ({
  collections: [],
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
  }
}

export const getters = {
  collections: (state) => {
    return state.collections
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
