<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions>
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="2" class="d-none d-md-block">
            <v-img :src="clip.thumbnail_url" height="65px" contain />
          </v-col>
          <v-col cols="8" sm="7" md="5" class="pa-0">
            <p class="caption text-left mb-2 text-truncate">
              {{ clip.category }}
            </p>
            <p class="text-left mb-0 text-truncate">
              {{ clip.title }}
            </p>
          </v-col>
          <v-col cols="2" class="text-center pa-0 d-none d-sm-block">
            <p class="caption mb-2">
              Views
            </p>
            {{ clip.view_count }}
          </v-col>
          <v-col cols="3" class="text-center text-sm-right pa-0 pr-4 d-none d-sm-block">
            <p class="caption mb-2">
              Clipped on
            </p>
            {{ format(clip.created_at) }}
          </v-col>
          <v-col cols="4" class="text-right pa-0 d-block d-sm-none caption">
            <p class="mb-2">
              {{ clip.view_count }} views
            </p>
            {{ format(clip.created_at) }}
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="text-center">
      <v-btn :href="clip.downloadLink" small>
        Download<v-icon class="ml-2">
          mdi-cloud-download
        </v-icon>
      </v-btn>
      <v-btn :href="'https://www.twitch.tv/videos/' + clip.video_id" target="_blank" small>
        Go to replay<v-icon class="ml-2">
          mdi-movie-outline
        </v-icon>
      </v-btn>
      <video-player :active="active" :slug="clip.id" :autoplay="true" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import moment from 'moment'

import VideoPlayer from '../utils/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  props: {
    clip: { type: Object, default: () => {} },
    active: { type: Boolean, default: false }
  },
  computed: {
  },
  methods: {
    format (value) {
      return moment(value).format('DD/MM/YYYY hh:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-expansion-panel:hover,
  .v-expansion-panel--active {
    background-color: #525252 !important;
  }
</style>
