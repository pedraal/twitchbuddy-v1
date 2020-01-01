<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row>
        <v-col class="pa-0">
          <p class="caption">
            {{ clip.category[0] ? clip.category[0].name:'' }}
          </p>
          <p>{{ clip.title }}</p>
        </v-col>
        <v-col class="text-center pa-0">
          <p class="caption">
            Views
          </p>
          {{ clip.view_count }}
        </v-col>
        <v-col class="text-right pa-0 mr-4">
          <p class="caption">
            Clipped on
          </p>
          {{ format(clip.created_at) }}
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="text-center">
      <v-btn @click.stop="download" small>
        Download<v-icon class="ml-2">
          mdi-cloud-download
        </v-icon>
      </v-btn>
      <v-btn @click.stop="gotoVod" small>
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
    },
    download () {
      window.open(this.clip.downloadLink, '_blank')
    },
    gotoVod () {
      window.open('https://www.twitch.tv/videos/' + this.clip.video_id, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
// .v-expansion-panel {
//   .v-expansion-panel-content {
//     div {
//       width: 400px;
//       height: 200px;
//       background-color: black;
//       p {
//         display: none;
//         color: white;
//       }
//     }
//   }
//   &.v-item--active {
//     .v-expansion-panel-content {
//       div {
//         p {
//           display: block;
//           color: white;
//         }
//       }
//     }
//   }
// }
</style>
