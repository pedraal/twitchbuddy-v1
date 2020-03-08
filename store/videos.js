import axios from 'axios'
import moment from 'moment'

export const state = () => ({
  collections: [{ id: '30396958', login: 'camak', display_name: 'CaMaK', type: '', broadcaster_type: 'partner', description: 'Ici on fait de tout ! FPS, indie game et surtout tous les OVNI vidéo-ludique ! Membre F-Team / Team LDLC / Team NVIDIA', profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7bdbacb4-7d12-4eb0-b3f2-3a89cf8219e3-profile_image-300x300.png', offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/7e249f64-ea11-49ff-b28d-9c331a19d6b1-channel_offline_image-1920x1080.png', view_count: 9486327, collection: [{ id: '560906879', user_id: '30396958', user_name: 'CaMaK', title: "FailyV - L'amnésique, le transplanté et le truand - !shop !insta !interview", description: '', created_at: '2020-03-02T19:38:13Z', published_at: '2020-03-02T19:38:13Z', url: 'https://www.twitch.tv/videos/560906879', thumbnail_url: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/1610fc7d9c443876c392_camak_759365441_47517414/thumb/thumb0-%{width}x%{height}.jpg', viewable: 'public', view_count: 4975, language: 'fr', type: 'archive', duration: '5h1m42s', ended_at: '2020-03-03T00:39:55.000Z' }] }, { id: '446383619', login: 'woodspices', display_name: 'woodspices', type: '', broadcaster_type: 'partner', description: 'Chaine Multigaming ( Gta Rp Faily V , Battle Royale , Fps , Mmo ... ) Aimez Vous et Respectez vous !!! ', profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/5aa878f9-cfa0-4ae9-a3c6-e2a62cecb5c2-profile_image-300x300.png', offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/9d340579-584c-4577-92d7-4181fe35201b-channel_offline_image-1920x1080.jpeg', view_count: 180676, collection: [{ id: '560777289', user_id: '446383619', user_name: 'woodspices', title: 'Faily V - Holy ? Et maintenant ???', description: '', created_at: '2020-03-02T14:31:46Z', published_at: '2020-03-02T14:31:46Z', url: 'https://www.twitch.tv/videos/560777289', thumbnail_url: 'https://static-cdn.jtvnw.net/cf_vods/d2nvs31859zcd8/769248ae7f5eed2d8c1a_woodspices_756896929_47363129/thumb/thumb0-%{width}x%{height}.jpg', viewable: 'public', view_count: 778, language: 'fr', type: 'archive', duration: '9h26m16s', ended_at: '2020-03-02T23:58:02.000Z' }] }],
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
