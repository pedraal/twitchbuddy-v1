<template>
  <v-card
    @click="selectedVideo && selectedVideo.id === video.id ? setSelected(null) : setSelected(video)"
    :class="{active: selectedVideo && selectedVideo.id === video.id} "
    class="my-2 pa-2"
    max-width="100%"
    outlined
  >
    <h5 class="caption">
      {{ video.title }}
    </h5>
    <p class="overline my-0">
      <v-icon small>
        mdi-ray-start
      </v-icon>
      &nbsp;{{ humanDate(video.created_at) }}&nbsp;{{ humanTime(video.created_at) }}
    </p>
    <p class="overline my-0">
      <v-icon small>
        mdi-ray-end
      </v-icon>
      &nbsp;{{ humanDate(video.ended_at) }}&nbsp;{{ humanTime(video.ended_at) }}
    </p>
    <p class="overline my-0">
      <v-icon small>
        mdi-clock
      </v-icon>
      &nbsp;{{ video.duration }}
    </p>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  props: {
    video: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('videos', ['selectedVideo'])
  },
  methods: {
    ...mapActions('videos', ['setSelected']),
    humanDate (val) {
      return moment(val).format('DD-MM-YYYY')
    },
    humanTime (val) {
      return moment(val).format('HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-card {
    h5 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.active{
      background: #727272;
    }
  }
</style>
