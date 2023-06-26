interface AuthorizationTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string[]
  token_type: 'bearer'
}

export interface TwitchApiResponse<T> {
  data: T[]
  pagination: {
    cursor: string
  }
}

export interface User {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  user_login: string
  user_name: string
  title: string
  description: string
  duration: string
  language: 'fr'
  stream_id: string
  thumbnail_url: string
  type: 'archive'
  url: string
  view_count: number
  viewable: 'public' | 'private'
  muted_segments: { duration: number; offset: number }[]
  created_at: string
  published_at: string
}

export interface Clip {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  game_name?: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
  vod_offset: number
}

export interface FormattedClip extends Pick<Clip, 'id' | 'title' | 'view_count' | 'video_id' | 'creator_name' | 'game_name'> {
  thumbnail: string
  created_at: Date
  vod_timestamp: Date
  vod_timestamp_duration: string
}

export interface Game {
  id: string
  name: string
  box_art_url: string
  igdb_id: number
}
