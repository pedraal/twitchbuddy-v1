import { TwitchApi } from './twitch-api'

describe('TwitchApi', () => {
  let api
  beforeEach(async () => {
    api = new TwitchApi(process.env.TWITCH_TOKEN, process.env.TWITCH_SECRET)
    await api.setupAxios()
  })

  test('Should return a twitch axios instance', async () => {
    delete api.axios
    await api.setupAxios()
    expect(api.axios.defaults.headers.common.Authorization).toBeDefined()
  })

  test('Should get oauth bearer token', async () => {
    const token = await api.getOauthToken()
    expect(token.length).toBeGreaterThan(0)
  })

  test('Should retrieve channel id', async () => {
    const id = await api.getChannelId('zerator')
    expect(id.length).toBeGreaterThan(0)
  })

  test('Should retrieve channel ids', async () => {
    const users = await api.getChannelId(['toneeuw', 'woodspices'])
    expect(users.length).toBeGreaterThan(0)
    expect(users[0].id.length).toBeDefined()
  })

  test('Should retrieve clips', async () => {
    const channelId = await api.getChannelId('zerator')
    const { data: clips, pagination } = await api.getClips({ broadcaster_id: channelId })
    expect(clips.length).toBeGreaterThan(0)
    expect(pagination).toBeDefined()
  })

  test('Should retrieve games', async () => {
    const channelId = await api.getChannelId('zerator')
    const { data: clips } = await api.getClips({ broadcaster_id: channelId })
    const gameIds = clips.map(clip => clip.game_id)
    const games = await api.getGames(gameIds)
    expect(games.length).toBeGreaterThan(0)
    expect(games[0].name).toBeDefined()
  })

  test('Should retrieve and prepare clips', async () => {
    const { data: clips, pagination } = await api.getAndPrepareClips({ channel: 'zerator' })
    expect(clips.length).toBeGreaterThan(0)
    expect(clips[0].title).toBeDefined()
    expect(clips[0].downloadLink).toBeDefined()
    expect(clips[0].category).toBeDefined()
    expect(pagination).toBeDefined()
  })

  test('Should retrieve replays', async () => {
    const channelId = await api.getChannelId('zerator')
    const { data: replays } = await api.getReplays(channelId)
    expect(replays.length).toBeGreaterThan(0)
    expect(replays[0].ended_at).toBeDefined()
  })
})
