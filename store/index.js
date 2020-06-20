export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'fr',
  loading: false,
  helpDisplay: true
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  },
  SET_HELP_DISPLAY (state, payload) {
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
