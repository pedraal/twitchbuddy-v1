import type { FormattedClip, Video } from '~/types'

export default function (video: Video, mostViewedClip: ComputedRef<FormattedClip | undefined>) {
  const { getEndedAt } = useVideoUtils()

  function clipPosition(clipDate: Date) {
    const videoStart = new Date(video.created_at)
    const videoEnd = getEndedAt(video)
    const videoDuration = videoEnd.getTime() - videoStart.getTime()
    const clipDuration = clipDate.getTime() - videoStart.getTime()

    return clipDuration / videoDuration * 100
  }

  function viewCountHeight(count: number) {
    if (!mostViewedClip.value)
      return
    return (count * 100) / mostViewedClip.value.view_count
  }

  const timeline = ref<HTMLElement>()
  const cursors = ref<[number | null, number | null]>([null, null])
  const selectedClip = ref<FormattedClip | null>(null)

  function resetCursors() {
    cursors.value = [null, null]
  }

  function resetSelectedClip() {
    selectedClip.value = null
  }

  function setCursor(event: MouseEvent) {
    const timelineDimensions = timeline.value!.getBoundingClientRect()
    if (cursors.value[0] && cursors.value[1]) {
      resetCursors()
    }
    else if (cursors.value[0]) {
      resetSelectedClip()
      cursors.value = [cursors.value[0], (event.clientX - timelineDimensions.left) * 100 / timelineDimensions.width]
    }
    else {
      resetSelectedClip()
      cursors.value = [(event.clientX - timelineDimensions.left) * 100 / timelineDimensions.width, null]
    }
  }

  function setSelectedClip(clip: FormattedClip) {
    if (selectedClip.value?.id === clip.id) {
      resetSelectedClip()
    }
    else {
      resetCursors()
      selectedClip.value = clip
    }
  }

  const sortedCursors = computed(() => {
    if (!cursors.value[0] || !cursors.value[1])
      return cursors.value

    return cursors.value.sort((a, b) => a! - b!)
  })

  const timestampCursors = computed(() => {
    return sortedCursors.value.map((cursor) => {
      if (!cursor)
        return null
      const videoStart = new Date(video.created_at)
      const videoEnd = getEndedAt(video)
      const videoDuration = videoEnd.getTime() - videoStart.getTime()
      const clipDuration = videoDuration * cursor / 100

      return new Date(videoStart.getTime() + clipDuration)
    })
  })

  function clipIsInsideCursors(clip: FormattedClip) {
    const startAt = timestampCursors.value[0]?.getTime()
    const endAt = timestampCursors.value[1]?.getTime()

    if (startAt && endAt)
      return clip.vod_timestamp.getTime() >= startAt && clip.vod_timestamp.getTime() <= endAt

    else if (startAt)
      return clip.vod_timestamp.getTime() >= startAt

    else if (endAt)
      return clip.vod_timestamp.getTime() <= endAt
    else
      return true
  }

  return {
    timeline,
    cursors,
    timestampCursors,
    selectedClip,
    setCursor,
    setSelectedClip,
    clipPosition,
    viewCountHeight,
    clipIsInsideCursors,
  }
}
