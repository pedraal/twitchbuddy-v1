import axios from 'axios'

export const state = () => ({
  clips: [],
  error: false,
  cursor: '',
  previousQuery: ''
})

export const mutations = {
  addClip (state, clip) {
    state.clips.push(clip)
  },
  emptyList (state) {
    state.clips = []
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
  setQuery (state, payload) {
    state.previousQuery = payload
  }
}

export const actions = {
  async loadClips ({ commit, state }, payload) {
    commit('SET_LOADING', true, { root: true })
    let query = ''
    if (state.cursor !== '') {
      query = state.previousQuery + '&cursor=' + state.cursor
    } else {
      if (payload.channel) {
        query = query + 'channel=' + payload.channel
      }
      if (payload.start) {
        query = query + '&start=' + payload.start
      }
      if (payload.end) {
        query = query + '&end=' + payload.end
      }
      commit('setQuery', query)
    }
    try {
      const res = await axios.get('/.netlify/functions/clips?' + query, { responseType: 'json' })
      for (const clip of res.data.clips) {
        commit('addClip', clip)
      }
      commit('SET_LOADING', false, { root: true })
      commit('setCursor', res.data.cursor)
    } catch (error) {
      commit('SET_LOADING', false, { root: true })
      commit('addError', true)
    }
  },
  emptyList ({ commit }) {
    commit('emptyList')
  },
  emptyError ({ commit }) {
    commit('emptyError')
  },
  setCursor ({ commit }, payload) {
    commit('setCursor', payload)
  }
}

export const getters = {
  clips: (state) => {
    return state.clips
  },
  error: (state) => {
    return state.error
  },
  cursor: (state) => {
    return state.cursor
  }
}
