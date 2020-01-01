export const state = () => ({
  clips: [],
  error: false,
  cursor: '',
  loading: false
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
  setLoading (state, payload) {
    state.loading = payload
  }
}

export const actions = {
  async loadClips ({ commit }, payload) {
    commit('emptyError')
    commit('emptyList')
    commit('setLoading', true)

    try {
      const channelRes = await this.$twitch.$get('/users?login=' + payload.channel)
      if (channelRes.data.length === 0) {
        throw new TwitchError('Channel not found', 'channel')
      }
      const clipsRes = await this.$twitch.$get(`/clips?first=100&broadcaster_id=${channelRes.data[0].id}&started_at=${payload.timeRange[0]}&ended_at=${payload.timeRange[1]}`)
      if (clipsRes.data.length === 0) {
        throw new TwitchError('No clips for this period', 'period')
      }
      let idsString = ''
      for (const clip of clipsRes.data) {
        idsString = idsString + 'id=' + clip.game_id + '&'
      }
      const gamesRes = await this.$twitch.$get(`/games?${idsString}`)
      if (gamesRes.data.length === 0) {
        throw new Error('No games for these ids')
      }
      for (const clip of clipsRes.data) {
        clip.category = gamesRes.data.filter((game) => {
          return game.id === clip.game_id
        })

        const thumbUrl = clip.thumbnail_url
        const toRemoveIndex = thumbUrl.indexOf('-preview-')

        clip.downloadLink = thumbUrl.substr(0, toRemoveIndex) + '.mp4'
        commit('addClip', clip)
      }
      commit('setLoading', false)

      commit('setCursor', clipsRes.pagination.cursor)
    } catch (error) {
      commit('setLoading', false)

      commit('addError', error)
    }
  },

  async loadMoreClips ({ commit, state }, payload) {
    try {
      commit('setLoading', true)

      const clipsRes = await this.$twitch.$get(`/clips?first=100&broadcaster_id=${state.clips[0].broadcaster_id}&started_at=${payload.timeRange[0]}&ended_at=${payload.timeRange[1]}&after=${state.cursor}`)
      let idsString = ''
      for (const clip of clipsRes.data) {
        idsString = idsString + 'id=' + clip.game_id + '&'
      }
      const gamesRes = await this.$twitch.$get(`/games?${idsString}`)
      const clips = clipsRes.data.map((clip) => {
        clip.category = gamesRes.data.filter((game) => {
          return game.id === clip.game_id
        })
        return clip
      })
      for (const clip of clips) {
        if (state.clips.filter(c => c.id === clip.id).length < 1) {
          commit('addClip', clip)
        }
      }
      commit('setLoading', false)
      commit('setCursor', clipsRes.pagination.cursor)
    } catch (error) {
      commit('setLoading', false)
      commit('addError', error)
    }
  },
  emptyList ({ commit }) {
    commit('emptyList')
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
  },
  loading: (state) => {
    return state.loading
  }
}

function TwitchError (message, target) {
  this.message = message
  this.target = target
}
