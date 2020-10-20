import Cookies from 'js-cookie'

export default function ({ $axios, store }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Cookies.get('tbtoken')
      }
    }
  })

  // Set baseURL to something different
  api.setBaseURL(process.env.API_URL)

  // Inject to context as $api
  inject('api', api)
  store.$api = api
}
