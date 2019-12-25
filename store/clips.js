export const state = () => ({
  clips: []
})

export const mutations = {
  addClip (state, clip) {
    state.clips.push(clip)
  },
  emptyList (state) {
    state.clips = []
  }
}

export const actions = {
  async getClips ({ commit }, payload) {
    try {
      const channelRes = await this.$twitch.$get('/users?login=' + payload)
      const clipsRes = await this.$twitch.$get('/clips?broadcaster_id=' + channelRes.data[0].id)
      for (const clip in clipsRes.data) {
        commit('addClip', clip)
      }
    } catch (error) {
      throw new Error(error)
    }
  },
  emptyList ({ commit }) {
    commit('emptyList')
  }
}

export const getters = {
  clips: (state) => {
    return state.clips
  }
}
