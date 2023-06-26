<script setup lang="ts">
import type { Video } from 'types'

const route = useRoute()

const { formatVideo } = useVideoUtils()

const { data: channel } = await useFetch(`/api/twitch/channel/${route.params.channel_name}`)
if (!channel.value)
  await navigateTo('/')

const { resources: videos, cursor, pending, execute } = await usePaginatedFetch<Video>('/api/twitch/videos', {
  cacheKey: `${route.params.channel_name}`,
  limit: 100,
  server: false,
  query: {
    channelId: channel.value!.id,
  },
})

const formatedVideos = computed(() => {
  return videos.value.map((video) => {
    return formatVideo(video)
  })
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <BackButton />
    </div>
    <VideoThumbnailGrid>
      <ChannelThumbnail v-if="channel" class="col-span-2" :channel="channel" />
    </VideoThumbnailGrid>
    <VideoThumbnailGrid>
      <NuxtLink v-for="video in formatedVideos" :key="video.id" :to="`/channels/${route.params.channel_name}/videos/${video.id}`">
        <VideoThumbnail :img-url="video.thumbnail" :title="video.title">
          <template #bottomLeft>
            {{ video.duration }}
          </template>
          <template #bottomRight>
            {{ video.start_at }}
          </template>
        </VideoThumbnail>
      </NuxtLink>
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
</template>
