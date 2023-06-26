export default async function () {
  if (process.client)
    return

  const accessToken = useCookie('accessToken')
  const refreshToken = useCookie('refreshToken')

  if (!accessToken.value && !refreshToken.value)
    return

  if (!accessToken.value && refreshToken.value) {
    const url = useRequestURL()

    return navigateTo(`/api/auth/refresh?redirect_uri=${url.pathname}`)
  }

  const store = useMainStore()
  const { data: user } = await useFetch('/api/twitch/me')
  if (user.value)
    store.user = user.value
}
