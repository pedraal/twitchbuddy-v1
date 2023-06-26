<script setup lang="ts">
import type { Clip, FormattedClip } from '~/types'

const route = useRoute()

const { formatThumbnail, getEndedAt } = useVideoUtils()
const { formatDate } = useDateUtils()
const { clipFormatter, clipMp4Link, clipVideoTwitchLink, clipTwitchLink } = useClipUtils()
const { ui } = useAppConfig()

const { data: video } = await useFetch(`/api/twitch/videos/${route.params.video_id}`)
if (!video.value)
  await navigateTo('/')

const { resources: clips, cursor, pending, execute } = await usePaginatedFetch<Clip>('/api/twitch/clips', {
  cacheKey: `${route.params.video_id}`,
  limit: 100,
  server: false,
  query: {
    channelId: video.value!.user_id,
    started_at: video.value!.created_at,
    ended_at: getEndedAt(video.value!).toISOString(),
  },
})

const timelineMode = computed(() => {
  return clips.value.every(clip => clip.vod_offset)
})

const formattedClips = computed<FormattedClip[]>(() => {
  if (!clips.value)
    return []
  return clips.value
    .map((clip) => {
      return clipFormatter(clip, video.value!)
    }).sort((a, b) => a.vod_timestamp.getTime() - b.vod_timestamp.getTime())
})

const mostViewedClip = computed(() => {
  if (!formattedClips.value)
    return
  return Array.from(formattedClips.value).sort((a, b) => b.view_count - a.view_count)[0]
})

const { timeline, cursors: timelineCursors, clipIsInsideCursors, selectedClip, setCursor, setSelectedClip, clipPosition, viewCountHeight } = useClipTimeline(video.value!, mostViewedClip)

const filteredClips = computed<FormattedClip[]>(() => {
  if (!timelineMode.value) {
    return formattedClips.value
  }
  else if (selectedClip.value) {
    return [selectedClip.value]
  }
  else if (timelineCursors.value[0] || timelineCursors.value[1]) {
    return formattedClips.value.filter((clip) => {
      return clipIsInsideCursors(clip)
    })
  }
  else {
    return formattedClips.value
  }
})

function timelineClipClasses(clip: FormattedClip) {
  if (selectedClip.value?.id === clip.id)
    return 'bg-primary-400 ring-primary-300'
  else if (clipIsInsideCursors(clip))
    return 'bg-primary-500 hover:bg-primary-400 hover:ring-primary-300'
  else
    return 'bg-neutral-500'
}

const inspectedClip = ref<FormattedClip | null>(null)
const isOpen = computed({
  get() {
    return !!inspectedClip.value
  },

  set() {
    inspectedClip.value = null
  },
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <BackButton :to="`/channels/${route.params.channel_name}`" />
    </div>
    <UiCard v-if="video">
      <div class="flex gap-2">
        <div>
          <div v-if="video.thumbnail_url.startsWith('https://vod-secure.twitch.tv/_404/')" class="flex h-40 w-80 items-center justify-center bg-slate-400 dark:bg-slate-900">
            <UiIcon name="i-heroicons-film" class="text-5xl opacity-40" />
          </div>
          <img v-else :src="formatThumbnail(video)" class="max-w-xs">
        </div>
        <div>
          <h1>{{ video.title }}</h1>
          <p>{{ new Date(video.created_at).toLocaleString() }}</p>
          <p>{{ getEndedAt(video).toLocaleString() }}</p>
        </div>
      </div>
    </UiCard>

    <template v-if="timelineMode">
      <UiSkeleton v-if="pending" class="my-4 h-24 w-full" />
      <div v-else-if="video" ref="timeline" class="my-4 h-24" :class="[ui.card.background, ui.card.rounded, ui.card.ring]" @click="setCursor">
        <div class="relative h-full w-full">
          <div
            v-for="clip in formattedClips"
            :key="clip.id"
            class="absolute bottom-0 w-1 -translate-x-1/2 cursor-pointer rounded-t-full ring-1 ring-transparent transition-all"
            :class="[timelineClipClasses(clip)]"
            :style="{ left: `${clipPosition(clip.vod_timestamp)}%`, height: `${Math.min(90, (5 + (viewCountHeight(clip.view_count) || 0)))}%` }"

            @click.stop="setSelectedClip(clip)"
          />
          <div
            v-for="(timelineCursor, idx) in timelineCursors" :key="idx" class="bg-primary-300/20 absolute top-0 h-full"
            :style="{ width: `${idx === 1 ? 100 - (timelineCursor || 0) : timelineCursor}%`, display: timelineCursor ? 'block' : 'none' }"
            :class="{ 'right-0': idx === 1 }"
          />
        </div>
      </div>
    </template>
    <UiAlert v-else color="yellow" icon="i-heroicons-exclamation-triangle">
      Timeline is disabled on this video because Twitch API is not providing clips video timestamps.
    </UiAlert>

    <VideoThumbnailGrid v-auto-animate>
      <VideoThumbnail v-for="clip in filteredClips" :key="clip.id" :img-url="clip.thumbnail" :title="clip.title" class="cursor-pointer" @click="inspectedClip = clip">
        <template #bottomLeft>
          <span class="inline-flex items-center">
            <UiIcon name="i-heroicons-eye" class="mr-1" />
            {{ clip.view_count }}
          </span>
        </template>
        <template v-if="timelineMode" #bottomRight>
          @ {{ clip.vod_timestamp_duration }}
        </template>
        <template v-else #bottomRight>
          {{ formatDate(new Date(clip.created_at)) }}
        </template>
      </VideoThumbnail>
      <template v-if="pending">
        <UiSkeleton v-for="i in 5" :key="i" class="w-full" style="aspect-ratio: 16/9;" />
      </template>
    </VideoThumbnailGrid>
    <div class="text-center">
      <UiButton v-if="cursor" :disabled="pending" @click="execute">
        Load more
      </UiButton>
    </div>
  </div>

  <UiModal v-model="isOpen" :ui="{ width: 'max-w-2xl' }">
    <UiCard v-if="inspectedClip">
      <div class="flex flex-col gap-4">
        <video :src="clipMp4Link(inspectedClip)" controls autoplay class="w-full rounded-lg" />
        <div class="flex gap-2">
          <UiButton :to="clipMp4Link(inspectedClip)" download icon="i-heroicons-cloud-arrow-down">
            Download
          </UiButton>
          <UiButton :to="clipTwitchLink(inspectedClip)" target="_blank" variant="outline" icon="i-heroicons-arrow-top-right-on-square">
            View on Twitch
          </UiButton>
          <UiButton :to="clipVideoTwitchLink(inspectedClip)" target="_blank" variant="outline" icon="i-heroicons-arrow-top-right-on-square">
            View replay on Twitch
          </UiButton>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <UiCard class="col-span-2">
            <p class="text-sm">
              Title :
            </p>
            <p>{{ inspectedClip.title }}</p>
          </UiCard>
          <UiCard>
            <p class="text-sm">
              Clipped by :
            </p>
            <p>{{ inspectedClip.creator_name }}</p>
          </UiCard>
          <UiCard>
            <p class="text-sm">
              Clipped at :
            </p>
            <p>{{ formatDate(new Date(inspectedClip.created_at)) }}</p>
          </UiCard>
          <UiCard>
            <p class="text-sm">
              View count :
            </p>
            <p>{{ inspectedClip.view_count }}</p>
          </UiCard>
          <UiCard>
            <p class="text-sm">
              Category :
            </p>
            <p>{{ inspectedClip.game_name }}</p>
          </UiCard>
        </div>
      </div>
    </UiCard>
  </UiModal>
</template>
