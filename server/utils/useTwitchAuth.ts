import type { AuthorizationTokenResponse } from '../../types'

export default function useTwitchAuth() {
  function init() {
    const state = generateState()

    const url = new URL('https://id.twitch.tv/oauth2/authorize')
    url.searchParams.append('client_id', process.env.TWITCH_CLIENT_ID!)
    url.searchParams.append('redirect_uri', `${process.env.APP_ORIGIN}/api/auth/callback`)
    url.searchParams.append('scope', '')
    url.searchParams.append('state', state)
    url.searchParams.append('response_type', 'code')

    return { state, url: url.toString() }
  }

  async function callback(code: string) {
    const url = new URL('https://id.twitch.tv/oauth2/token')
    url.searchParams.append('client_id', process.env.TWITCH_CLIENT_ID!)
    url.searchParams.append('client_secret', process.env.TWITCH_CLIENT_SECRET!)
    url.searchParams.append('code', code)
    url.searchParams.append('grant_type', 'authorization_code')
    url.searchParams.append('redirect_uri', `${process.env.APP_ORIGIN}/api/auth/callback`)

    const response = await $fetch<AuthorizationTokenResponse>(url.toString(), { method: 'POST' })

    return { access_token: response.access_token, expires_in: response.expires_in, refresh_token: response.refresh_token }
  }

  async function refreshAccessToken(refreshToken: string) {
    const url = new URL('https://id.twitch.tv/oauth2/token')
    url.searchParams.append('client_id', process.env.TWITCH_CLIENT_ID!)
    url.searchParams.append('client_secret', process.env.TWITCH_CLIENT_SECRET!)
    url.searchParams.append('grant_type', 'refresh_token')
    url.searchParams.append('refresh_token', refreshToken)

    const response = await $fetch<AuthorizationTokenResponse>(url.toString(), { method: 'POST' })

    return { access_token: response.access_token, expires_in: response.expires_in, refresh_token: response.refresh_token }
  }

  return {
    init,
    callback,
    refreshAccessToken,
  }
}

function generateState() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
