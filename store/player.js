import moment from 'moment'

export const state = () => ({
  slots: [],
  referenceSlot: '',
  globalState: 'init',
  volume: 0.5,
  loading: false
})

export const mutations = {
  ADD_SLOT (state, payload) {
    state.slots.push(payload)
  },
  EMPTY_SLOTS (state) {
    state.slots = []
  },
  SET_REFERENCE_SLOT (state, payload) {
    state.referenceSlot = payload
  },
  SET_GLOBAL_STATE (state, payload) {
    state.globalState = payload
  },
  SET_VOLUME (state, payload) {
    state.volume = payload
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  },
  SET_VIDEO_TIMESTAMP (state, payload) {
    state.slots.find(slot => slot.id === payload.id).video.timestamp = payload.timestamp
  },
  SET_VIDEO_STATE (state, payload) {
    state.slots.find(slot => slot.id === payload.id).video.state = payload.state
  }
}

export const actions = {
  buildSlots ({ commit }, collections) {
    collections.forEach((collection) => {
      commit('ADD_SLOT', slotBuilder(collection))
    })
  },
  globalSync ({ commit, state }) {
    state.slots
      .filter(slot => slot.id !== state.referenceSlot)
      .forEach(slot => commit('SET_VIDEO_STATE', { id: slot.id, state: 'sync' }))
  }
}

export const getters = {
  channels: (state) => {
    return state.slots.map((slot) => {
      return {
        id: slot.id,
        name: slot.channelName,
        picture: slot.channelPicture
      }
    })
  },
  isRef: state => (id) => {
    return state.referenceSlot === id
  },
  referenceVideoData: (state) => {
    const video = state.slots.find(slot => slot.id === state.referenceSlot).video
    return {
      createdAt: video.createdAt,
      endedAt: video.endedAt,
      timestamp: 0
    }
  },
  slotStatus: state => (id) => {
    if (id === state.referenceSlot) return 'reference'

    const target = state.slots.find(slot => slot.id === id)
    const ref = state.slots.find(slot => slot.id === state.referenceSlot)

    const offset = ref.video.timestamp - moment(target.video.createdAt).diff(moment(ref.video.createdAt), 'seconds', true)

    if (offset < 0) return 'idle'
    else if (moment(target.video.createdAt).add(offset, 'seconds').isAfter(moment(target.video.endedAt))) return 'ended'
    else return 'running'
  },
  allPlayersReady: (state) => {
    return state.slots.every(slot => slot.video.state === 'ready')
  },
  calcOffset: state => (id) => {
    const target = state.slots.find(slot => slot.id === id)
    const ref = state.slots.find(slot => slot.id === state.referenceSlot)
    const offset = ref.video.timestamp - moment(target.video.createdAt).diff(moment(ref.video.createdAt), 'seconds', true)
    return offset
  }
}

const slotBuilder = (collection) => {
  const video = collection.videos[0]
  return {
    id: collection.id,
    channelName: video.user_name,
    channelPicture: collection.profile_image_url || '',
    video: {
      id: video.id,
      createdAt: video.created_at,
      duration: video.duration,
      endedAt: video.ended_at,
      state: 'init',
      timestamp: '0'
    }
  }
}
