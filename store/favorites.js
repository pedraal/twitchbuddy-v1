
export const state = () => ({
  favorites: []
})

export const mutations = {
  SET_FAVORITES (state, favorites) {
    state.favorites = [...favorites]
  }
}

export const actions = {
  async addFavorite ({ commit, state }, clip) {
    const { data } = await this.$api.patch('/me/favorites', [...state.favorites, clip])

    commit('SET_FAVORITES', data)
  },
  async removeFavorite ({ commit, state }, clip) {
    const { data } = await this.$api.patch('/me/favorites', state.favorites.filter(fav => fav.id !== clip.id))

    commit('SET_FAVORITES', data)
  },
  async emptyFavorites ({ commit }) {
    const { data } = await this.$api.patch('/me/favorites', [])

    commit('SET_FAVORITES', data)
  },
  async fetchFavorites ({ commit }) {
    const { data } = await this.$api.get('/me/favorites')
    commit('SET_FAVORITES', data)
  }
}

export const getters = {
  favorites: (state) => {
    return state.favorites
  },
  isFavorite: state => (id) => {
    return state.favorites.find(fav => fav.id === id)
  }
}
