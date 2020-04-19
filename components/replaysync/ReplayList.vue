<template>
  <div>
    <h2 class="text-center">
      {{ collection.display_name }}
    </h2>
    <ReplayListItem v-for="video in collection.videos" :video="video" :key="video.id" />
  </div>
</template>

<script>
import ReplayListItem from '@/components/replaysync/ReplayListItem'

export default {
  components: {
    ReplayListItem
  },
  props: {
    collection: {
      type: Object,
      required: true
    }
  }

}
</script>
