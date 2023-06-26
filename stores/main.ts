import type { User, Video } from '~/types'

export const useMainStore = defineStore('main', () => {
  const user = ref<User>()
  const channel = ref<User>()
  const videos = ref<Video[]>()

  return {
    user,
    channel,
    videos,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
