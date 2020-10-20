import sortBy from 'lodash/sortBy'
import reverse from 'lodash/reverse'
import findIndex from 'lodash/findIndex'

export const state = () => ({
  ownedLists: [],
  sharedLists: []
})

export const mutations = {
  SET_OWNED_LISTS (state, payload) {
    state.ownedLists = payload
  },
  PUSH_OWNED_LIST (state, payload) {
    state.ownedLists.push(payload)
  },
  UPDATE_OWNED_LIST (state, payload) {
    const listIndex = findIndex(state.ownedLists, el => el._id === payload._id)
    state.ownedLists[listIndex] = payload
  },
  DELETE_OWNED_LIST (state, payload) {
    const listIndex = findIndex(state.ownedLists, el => el._id === payload)
    state.ownedLists.splice(listIndex, 1)
  },
  SET_SHARED_LISTS (state, payload) {
    state.sharedLists = payload
  }
}

export const actions = {
  async fetchLists ({ commit }, payload) {
    let response
    if (payload === 'owned' || !payload) {
      response = await this.$api.get('/lists', {
        name: payload
      })
      commit('SET_OWNED_LISTS', response.data)
    } else if (payload === 'shared' || !payload) {
      response = await this.$api.get('/lists/shared', {
        name: payload
      })
      commit('SET_SHARED_LISTS', response.data)
    }
  },
  async createList ({ commit }, payload) {
    const response = await this.$api.post('/lists', {
      name: payload
    })

    commit('PUSH_OWNED_LIST', response.data)
  },
  async addClip ({ commit, state }, payload) {
    const list = state.ownedLists.find(el => el._id === payload.listId)

    const response = await this.$api.patch(`/lists/${list._id}`, {
      clips: [...list.clips, payload.clip]
    })
    commit('UPDATE_OWNED_LIST', response.data)
  },
  async removeClip ({ commit }, payload) {

  },
  async deleteList ({ commit }, payload) {
    await this.$api.delete(`/lists/${payload}`)
    commit('DELETE_OWNED_LIST', payload)
  },
  async patchList (ctx, payload) {

  }
}

export const getters = {
  ownedLists (state) {
    return reverse(sortBy(state.ownedLists, ['updatedAt']))
  },
  sharedLists (state) {
    return reverse(sortBy(state.sharedLists, ['updatedAt']))
  }
}
