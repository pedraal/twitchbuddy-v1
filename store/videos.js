import axios from 'axios'
import moment from 'moment'

moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
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
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans'
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal (number) {
    return number + (number === 1 ? 'er' : 'e')
  },
  meridiemParse: /PD|MD/,
  isPM (input) {
    return input.charAt(0) === 'M'
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem (hours, minutes, isLower) {
    return hours < 12 ? 'PD' : 'MD'
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4 // Used to determine first week of the year.
  }
})

export const state = () => ({
  collections: [],
  referenceVideo: null,
  selectedVideoTimestamp: 0,
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
      const res = await axios.get('/.netlify/functions/videos?channel=' + payload, { responseType: 'json' })
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
      return [moment(date).locale(rootState.locale).format('LL'), [...new Set(channelsPictures.flat())], videos.flat()]
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
