export const state = () => ({
  locales: ['en', 'fr'],
  locale: 'fr',
  loading: false
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale
    }
  },
  SET_LOADING (state, payload) {
    state.loading = payload
  }
}

export const getters = {
  loading: (state) => {
    return state.loading
  }
}
