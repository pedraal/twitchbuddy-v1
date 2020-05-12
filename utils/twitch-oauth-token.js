const axios = require('axios')

const CLIENT_ID = process.env.TWITCH_TOKEN
const CLIENT_SECRET = process.env.TWITCH_SECRET

const getTwitchOauthToken = async function () {
  try {
    const res = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`)
    return 'Bearer ' + res.data.access_token
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  getTwitchOauthToken
}
