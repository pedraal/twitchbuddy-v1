import type { Clip, Video } from '~/types'

export default function () {
  const { formatDistance } = useDateUtils()

  function parseDurationToSeconds(duration: string) {
    const matches = duration.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/)
    if (!matches)
      return 0
    const hours = matches[1] ? Number.parseInt(matches[1]) : 0
    const minutes = matches[2] ? Number.parseInt(matches[2]) : 0
    const seconds = matches[3] ? Number.parseInt(matches[3]) : 0
    return hours * 3600 + minutes * 60 + seconds
  }

  function parseSecondsToDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    const parts = []
    if (hours > 0)
      parts.push(`${hours}h`)

    if (minutes > 0)
      parts.push(`${minutes}m`)

    if (remainingSeconds > 0 || parts.length === 0)
      parts.push(`${remainingSeconds}s`)

    return parts.join('')
  }

  function getEndedAt(video: Video) {
    const createdAt = new Date(video.created_at)
    const duration = parseDurationToSeconds(video.duration)
    return new Date(createdAt.getTime() + duration * 1000)
  }

  function formatVideo(video: Video) {
    return {
      id: video.id,
      title: video.title,
      thumbnail: formatThumbnail(video),
      url: `https://www.twitch.tv/videos/${video.id}`,
      start_at: formatDistance(new Date(video.created_at)),
      duration: video.duration,
    }
  }

  function formatThumbnail(video: Video | Clip, width = 640, height = 360) {
    const thumbnail = video.thumbnail_url.replace('%{width}', String(width)).replace('%{height}', String(height))
    return thumbnail
  }

  return {
    parseDurationToSeconds,
    parseSecondsToDuration,
    getEndedAt,
    formatThumbnail,
    formatVideo,
  }
}
