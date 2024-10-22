import moment from 'moment'

moment.updateLocale('fr', {
  months: 'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Août_Septembre_Octobre_Novembre_Décembre'.split('_'),
  weekdays: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Aujourd’hui]',
    nextDay: '[Demain]',
    nextWeek: 'dddd',
    lastDay: '[Hier]',
    lastWeek: 'dddd [dernier]',
    sameElse: 'LL'
  }
})

moment.updateLocale('en', {
  calendar: {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'LL'
  }
})

export const state = () => ({
  collections: [],
  referenceVideo: null,
  error: false,
  selectedVideos: []
})

export const mutations = {
  ADD_COLLECTION (state, collection) {
    state.collections.push(collection)
  },
  EMPTY_COLLECTIONS (state) {
    state.collections = []
  },
  SET_ERROR (state, error) {
    state.error = error
  },
  ADD_SELECTED_VIDEO (state, payload) {
    state.selectedVideos.push(replaysyncSerializer(payload))
  },
  RESET_SELECTED_VIDEOS (state) {
    state.selectedVideos = []
  },
  REMOVE_SELECTED_VIDEO (state, id) {
    state.selectedVideos = state.selectedVideos.filter(v => v.video.id !== id)
  }
}

export const actions = {
  async fetchCollections ({ commit }, payload) {
    commit('SET_LOADING', true, { root: true })
    try {
      const res = await this.$api.get('/replays?channels=' + payload, { responseType: 'json' })
      res.data.forEach(collection => commit('ADD_COLLECTION', collection))
      commit('SET_LOADING', false, { root: true })
    } catch (error) {
      commit('SET_LOADING', false, { root: true })
      commit('SET_ERROR', error)
    }
  },
  removeSelectedVideo ({ commit }, id) {
    commit('REMOVE_SELECTED_VIDEO', id)
  }
}

export const getters = {
  collections: (state, getters) => {
    if (getters.referenceVideo) {
      return state.collections.map((collection) => {
        return {
          ...collection,
          videos: collection.videos.filter(
            video =>
              moment(video.created_at).isBetween(
                moment(getters.referenceVideo.createdAt),
                moment(getters.referenceVideo.endedAt),
                null,
                []) ||
            moment(video.ended_at).isBetween(
              moment(getters.referenceVideo.createdAt),
              moment(getters.referenceVideo.endedAt),
              null,
              []) ||
            moment(getters.referenceVideo.createdAt).isBetween(
              moment(video.created_at),
              moment(video.ended_at),
              null,
              []) ||
            moment(getters.referenceVideo.endedAt).isBetween(
              moment(video.created_at),
              moment(video.ended_at),
              null,
              []))
        }
      })
    }
    return state.collections
  },
  calendar: (state, getters, rootState) => {
    if (getters.collections.length === 0) return
    const dates = [...new Set(getters.collections.map(c => c.videos.map(v => v.created_at.substr(0, 10))).flat())].sort().reverse()
    return dates.map((date) => {
      const videos = []
      const channelsPictures = []
      getters.collections.map(c => c.videos.map((v) => {
        return {
          ...v,
          collectionId: c.id,
          channelPicture: c.profile_image_url,
          channelName: v.user_name === '' ? c.display_name : v.user_name
        }
      })).forEach((pack) => {
        const filteredPack = pack.filter(el => el.created_at.includes(date)).flat()
        videos.push(filteredPack)
        channelsPictures.push(filteredPack.map(p => p.channelPicture))
      })
      return [moment(date).locale(rootState.locale).calendar(), [...new Set(channelsPictures.flat())], videos.flat()]
    })
  },
  referenceVideo: (state) => {
    return state.selectedVideos.length > 0 ? state.selectedVideos[0].video : null
  },
  error: (state) => {
    return state.error
  }
}

const replaysyncSerializer = (video) => {
  return {
    id: video.collectionId,
    channelName: video.channelName,
    channelPicture: video.channelPicture || '',
    video: {
      id: video.id,
      title: video.title,
      createdAt: video.created_at,
      duration: video.duration,
      endedAt: video.ended_at,
      state: 'init',
      timestamp: '0'
    }
  }
}
