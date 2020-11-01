// import sortBy from 'lodash/sortBy'
// import reverse from 'lodash/reverse'
import findIndex from 'lodash/findIndex'

import Vue from 'vue'

export const state = () => ({
  ownedLists: [],
  sharedLists: [],
  folder: 'ownedLists',
  selectedListId: null
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
    Vue.set(state.ownedLists, listIndex, payload)
  },
  DELETE_OWNED_LIST (state, payload) {
    const listIndex = findIndex(state.ownedLists, el => el._id === payload)
    state.ownedLists.splice(listIndex, 1)
  },
  SET_SHARED_LISTS (state, payload) {
    state.sharedLists = payload
  },
  SET_FOLDER (state, payload) {
    state.folder = payload
  },
  SET_SELECTED_LIST_ID (state, payload) {
    state.selectedListId = payload
  }
}

export const actions = {
  async fetchLists ({ commit }, payload) {
    let response
    if (payload === 'ownedLists' || !payload) {
      response = await this.$api.get('/lists', {
        name: payload
      })
      commit('SET_OWNED_LISTS', response.data)
    } else if (payload === 'sharedLists' || !payload) {
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
  async removeClip ({ commit, state, getters }, payload) {
    const clips = [...getters.selectedList.clips]
    clips.splice(payload, 1)
    const response = await this.$api.patch(`/lists/${state.selectedListId}`, {
      clips
    })
    commit('UPDATE_OWNED_LIST', response.data)
  },
  async emptyList ({ commit, state }, payload) {
    const response = await this.$api.patch(`/lists/${state.selectedListId}`, {
      clips: []
    })
    commit('UPDATE_OWNED_LIST', response.data)
  },
  async deleteList ({ commit, state }) {
    await this.$api.delete(`/lists/${state.selectedListId}`)
    commit('DELETE_OWNED_LIST', state.selectedListId)
    commit('SET_SELECTED_LIST_ID', null)
  },
  setFolder ({ commit, dispatch }, payload) {
    commit('SET_FOLDER', payload)
    commit('SET_SELECTED_LIST_ID', null)
    dispatch('fetchLists', payload)
  },
  setSelectedListId ({ commit }, payload) {
    commit('SET_SELECTED_LIST_ID', payload)
  },
  async renameList ({ commit, state }, payload) {
    const response = await this.$api.patch(`/lists/${state.selectedListId}`, {
      name: payload
    })
    commit('UPDATE_OWNED_LIST', response.data)
  },
  async joinList ({ dispatch }, payload) {
    await this.$api.patch(`/lists/${payload}/join`)
    dispatch('fetchLists', 'sharedLists')
  },
  async leaveList ({ commit, dispatch, state }) {
    const id = `${state.selectedListId}`
    commit('SET_SELECTED_LIST_ID', null)
    await this.$api.patch(`/lists/${id}/leave`)
    dispatch('fetchLists', 'sharedLists')
  }
}

export const getters = {
  ownedLists (state) {
    return state.ownedLists
  },
  sharedLists (state) {
    return state.sharedLists
  },
  folderLists (state, getters) {
    return getters[state.folder]
  },
  selectedList (state, getters) {
    return getters.folderLists.find(el => el._id === state.selectedListId)
  }
}
