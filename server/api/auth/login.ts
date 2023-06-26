export default defineEventHandler((event) => {
  const { init } = useTwitchAuth()
  const { state, url } = init()
  setCookie(event, 'state', state)
  return sendRedirect(event, url)
})
