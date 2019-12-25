export default function ({ $axios, redirect }, inject) {
  // Create a custom axios instance
  const twitch = $axios.create({
    headers: {
      common: {
        Accept: 'application/vnd.twitchtv.v5+json',
        'Client-ID': process.env.TWITCH_TOKEN
      }
    }
  })

  // Set baseURL to something different
  twitch.setBaseURL('https://api.twitch.tv/helix/')

  // Inject to context as $api
  inject('twitch', twitch)
}
