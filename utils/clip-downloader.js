import axios from 'axios'

export default async (clip, progressCallback) => {
  const { data } = await axios.get('https://proxy.twitchbuddy.app/' + clip.downloadLink, {
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    responseType: 'blob',
    onDownloadProgress (progressEvent) {
      progressCallback(progressEvent)
    }
  })
  const a = document.createElement('a')
  const link = window.URL.createObjectURL(data)
  a.href = link
  const filename = sluggify(clip.title).length > 0 ? sluggify(clip.title) : sluggify(clip.broadcaster_name + ' ' + clip.category)
  a.download = filename + '.mp4'
  a.click()
}

const sluggify = (val) => {
  let str = val
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaaaeeeeiiiioooouuuunc______'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }
  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

  return str
}
