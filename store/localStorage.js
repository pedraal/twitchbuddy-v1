
export const state = () => ({
  favorites: []
})

export const mutations = {
  ADD_FAVORITE (state, clip) {
    state.favorites.push(clip)

    localStorage.tb_favorites = JSON.stringify(state.favorites)
  },
  EMPTY_FAVORITES (state) {
    state.favorites = []

    localStorage.tb_favorites = JSON.stringify(state.favorites)
  },
  SET_FAVORITES (state, favorites) {
    state.favorites = [...favorites]
  },
  REMOVE_FAVORITE (state, clip) {
    const index = state.favorites.findIndex(fav => fav.id === clip.id)
    state.favorites.splice(index, 1)

    localStorage.tb_favorites = JSON.stringify(state.favorites)
  }
}

export const actions = {
  addFavorite ({ commit }, clip) {
    commit('ADD_FAVORITE', clip)
  },
  removeFavorite ({ commit }, clip) {
    commit('REMOVE_FAVORITE', clip)
  },
  emptyFavorites ({ commit }) {
    commit('EMPTY_FAVORITES')
  },
  fetchLocalFavorites ({ commit }) {
    commit('SET_FAVORITES', JSON.parse(localStorage.tb_favorites))
  },
  writeLocalFavorites ({ state }) {
    localStorage.tb_favorites = JSON.stringify(state.favorites)
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
