export const state = () => ({
  loading: false,
  helpDisplay: true
})

export const mutations = {
  setLoading (state, payload) {
    state.loading = payload
  },
  setHelpDisplay (state, payload) {
    state.helpDisplay = payload
  }
}

export const getters = {
  loading: (state) => {
    return state.loading
  },
  helpDisplay: (state) => {
    return state.helpDisplay
  }
}
