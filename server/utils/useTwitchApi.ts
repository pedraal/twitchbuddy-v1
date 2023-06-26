import type { Clip, Game, TwitchApiResponse, User, Video } from '../../types'

export default function useTwitchApi(token: string) {
  async function getUser(username?: string) {
    const users = await _fetch<User>('users', username ? { login: username } : undefined)

    return users.data[0]
  }

  async function getVideos(userId: string, options: { limit?: number; cursor?: string } = {}) {
    const limit = options.limit || 100
    const cursor = options.cursor || ''

    const response = await _fetch<Video>('videos', {
      user_id: userId,
      type: 'archive',
      first: limit,
      after: cursor,
    })

    return response
  }

  async function getVideo(videoId: string | string[]) {
    const videos = await _fetch<Video>('videos', {
      id: videoId,
    })

    return videos.data[0]
  }

  async function getClips(channelId: string, options: { started_at?: string; ended_at?: string; limit?: number; cursor?: string } = {}) {
    const started_at = options.started_at || ''
    const ended_at = options.ended_at || ''
    const limit = options.limit || 100
    const cursor = options.cursor || ''

    const response = await _fetch<Clip>('clips', {
      broadcaster_id: channelId,
      first: limit,
      after: cursor,
      started_at,
      ended_at,
    })

    return response
  }

  async function getGames(gameIds: string[]) {
    const uniqueGameIds = gameIds.reduce((acc, id) => acc.includes(id) ? acc : [...acc, id], [] as string[])
    const games = await _fetch<Game>('games', {
      id: uniqueGameIds,
    })

    return games.data
  }

  const appConfig = useAppConfig()
  async function _fetch<T>(resource: string, params?: Record<string, string | number | string[]>) {
    if (!token)
      throw new Error('No access token')

    const url = new URL(`https://api.twitch.tv/helix/${resource}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => {
            url.searchParams.append(key, v)
          })
        }
        else {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    const response: TwitchApiResponse<T> = await $fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Client-ID': appConfig.twitchClientId,
      },
    })

    return response
  }

  return {
    getUser,
    getVideos,
    getVideo,
    getClips,
    getGames,
  }
}
