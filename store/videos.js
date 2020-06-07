import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  collections: [{ id: '30396958', login: 'camak', display_name: 'CaMaK', type: '', broadcaster_type: 'partner', description: 'Ici on fait de tout ! FPS, indie game et surtout tous les OVNI vidéo-ludique ! Membre F-Team / Team LDLC / Team NVIDIA', profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7bdbacb4-7d12-4eb0-b3f2-3a89cf8219e3-profile_image-300x300.png', offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7e249f64-ea11-49ff-b28d-9c331a19d6b1-channel_offline_image-1920x1080.png', view_count: 10584934, videos: [{ id: '642217276', user_id: '30396958', user_name: 'CaMaK', title: 'FailyV - On fait la course ?  !insta !shop', description: '', created_at: '2020-06-05T19:32:05Z', published_at: '2020-06-05T19:32:05Z', url: 'https://www.twitch.tv/videos/642217276', thumbnail_url: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/20a160524c916adbc034_camak_1855364737_116022600//thumb/thumb0-%{width}x%{height}.jpg', viewable: 'public', view_count: 2014, language: 'fr', type: 'archive', duration: '4h26m59s', ended_at: '2020-06-05T23:59:04.000Z' }] }, { id: '446383619', login: 'woodspices', display_name: 'woodspices', type: '', broadcaster_type: 'partner', description: 'Chaine Multigaming ( Gta Rp Faily V , Battle Royale , Fps , Mmo ... ) Aimez Vous et Respectez vous !!! ', profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4602253e-7761-40c0-9481-dcccb0fddc3c-profile_image-300x300.png', offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/9d340579-584c-4577-92d7-4181fe35201b-channel_offline_image-1920x1080.jpeg', view_count: 638037, videos: [{ id: '641986848', user_id: '446383619', user_name: 'woodspices', title: 'Faily V - Holy Brokers - The Race | Road to 1K Sub | ', description: '', created_at: '2020-06-05T15:14:04Z', published_at: '2020-06-05T15:14:04Z', url: 'https://www.twitch.tv/videos/641986848', thumbnail_url: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/0555fdcda53a2a60efe4_woodspices_38494151296_1474788536/thumb/custom-2f1f541f-510e-453c-86b2-65c79eaa96d8-%{width}x%{height}.png', viewable: 'public', view_count: 1145, language: 'fr', type: 'archive', duration: '8h26m55s', ended_at: '2020-06-05T23:40:59.000Z' }] }],
  selectedVideo: { id: '642217276', user_id: '30396958', user_name: 'CaMaK', title: 'FailyV - On fait la course ?  !insta !shop', description: '', created_at: '2020-06-05T19:32:05Z', published_at: '2020-06-05T19:32:05Z', url: 'https://www.twitch.tv/videos/642217276', thumbnail_url: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/20a160524c916adbc034_camak_1855364737_116022600//thumb/thumb0-%{width}x%{height}.jpg', viewable: 'public', view_count: 2014, language: 'fr', type: 'archive', duration: '4h26m59s', ended_at: '2020-06-05T23:59:04.000Z' },
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
