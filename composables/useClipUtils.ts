import type { Clip, FormattedClip, Video } from 'types'

export default function () {
  const { formatThumbnail, parseSecondsToDuration } = useVideoUtils()
  function clipFormatter(clip: Clip, video: Video): FormattedClip {
    return {
      id: clip.id,
      title: clip.title,
      creator_name: clip.creator_name,
      view_count: clip.view_count,
      video_id: clip.video_id,
      game_name: clip.game_name,
      thumbnail: formatThumbnail(clip),
      created_at: new Date(clip.created_at),
      vod_timestamp: new Date(new Date(video.created_at).getTime() + (clip.vod_offset * 1000)),
      vod_timestamp_duration: parseSecondsToDuration(clip.vod_offset),
    }
  }

  function clipMp4Link(clip: FormattedClip) {
    return `${clip.thumbnail.substr(0, clip.thumbnail.indexOf('-preview-'))}.mp4`
  }

  function clipVideoTwitchLink(clip: FormattedClip) {
    return `https://twitch.tv/videos/${clip.video_id}`
  }

  function clipTwitchLink(clip: FormattedClip) {
    return `https://clips.twitch.tv/${clip.id}`
  }

  return {
    clipFormatter,
    clipMp4Link,
    clipVideoTwitchLink,
    clipTwitchLink,
  }
}
