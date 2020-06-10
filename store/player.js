import moment from 'moment'

export const state = () => ({
  slots: [],
  referenceSlot: '',
  globalState: 'init',
  volume: 0.5,
  quality: '360p30',
  autoSync: true,
  canAutoSync: false
})

export const mutations = {
  HARD_RESET_PLAYER (state) {
    state.slots = []
    state.referenceSlot = ''
    state.globalState = 'init'
    state.volume = 0.5
    state.autoSync = true
    state.canAutoSync = false
  },
  SOFT_RESET_PLAYER (state) {
    state.globalState = 'init'
    state.canAutoSync = false
  },
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
  SET_QUALITY (state, payload) {
    state.quality = payload
  },
  SET_VIDEO_TIMESTAMP (state, payload) {
    state.slots.find(slot => slot.id === payload.id).video.timestamp = payload.timestamp
  },
  SET_VIDEO_STATE (state, payload) {
    state.slots.find(slot => slot.id === payload.id).video.state = payload.state
  },
  SET_AUTO_SYNC (state, payload) {
    state.autoSync = payload
  },
  SET_CAN_AUTO_SYNC (state, payload) {
    state.canAutoSync = payload
  }
}

export const actions = {
  buildSlots ({ commit }, collections) {
    collections.forEach((collection) => {
      if (collection.videos.length === 0) return
      commit('ADD_SLOT', slotBuilder(collection))
    })
  },
  sync ({ commit }, newValue) {
    commit('SET_GLOBAL_STATE', 'sync')
    setTimeout(() => {
      commit('SET_GLOBAL_STATE', newValue)
    }, 2000)
    setTimeout(() => {
      commit('SET_CAN_AUTO_SYNC', true)
    }, 2500)
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
    return state.slots.every(slot => slot.video.state === 'ready' || slot.video.state === 'paused' || slot.video.state === 'playing')
  },
  allPlayersPlaying: (state) => {
    return state.slots.every(slot => slot.video.state === 'playing')
  },
  calcExpected: state => (id) => {
    const target = state.slots.find(slot => slot.id === id)
    const ref = state.slots.find(slot => slot.id === state.referenceSlot)
    const offset = ref.video.timestamp - moment(target.video.createdAt).diff(moment(ref.video.createdAt), 'seconds', true)
    return offset
  },
  slotSyncStatus: (state, getters) => (id) => {
    const target = state.slots.find(slot => slot.id === id)
    const expected = getters.calcExpected(target.id)
    const delta = (expected - target.video.timestamp) - 1

    if (delta < 2) {
      return 'good'
    } else if (delta >= 2 && delta < 5) {
      return 'ok'
    } else {
      return 'bad'
    }
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
