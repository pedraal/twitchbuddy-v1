<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions class="py-0">
      <v-container>
        <v-row justify="center" align="center">
          <v-col cols="3" md="2">
            <v-img :src="clip.thumbnail_url" height="65px" contain />
          </v-col>
          <v-col cols="5" sm="7" md="5" class="pa-0">
            <p class="caption text-left mb-2 text-truncate">
              {{ clip.category }}
            </p>
            <p class="text-left mb-0 text-truncate">
              {{ clip.title }}
            </p>
          </v-col>
          <v-col cols="2" class="text-right pa-0 d-none d-sm-block">
            <p class="caption mb-2">
              {{ clip.view_count }} {{ $t('clips.item.views') }}
            </p>
            <p class="caption mb-0">
              {{ $t('clips.item.by') }} {{ clip.creator_name }}
            </p>
          </v-col>
          <v-col cols="3" class="text-center text-sm-right pa-0 pr-4 d-none d-sm-block">
            <p class="caption mb-2">
              {{ $t('clips.item.createdAt') }}
            </p>
            <p class="caption mb-0">
              {{ format(clip.created_at) }}
            </p>
          </v-col>
          <v-col cols="4" class="text-right pa-0 d-block d-sm-none caption">
            <p class="mb-0">
              {{ clip.view_count }} {{ $t('clips.item.views') }}
            </p>
            <p class="mb-0">
              {{ format(clip.created_at) }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="text-center">
      <v-btn @click="downloadAndRename(clip.downloadLink, clip.title)" class="download-btn" small>
        <transition name="fade">
          <div v-if="!loading">
            {{ $t('clips.item.download') }}
            <v-icon class="ml-2">
              mdi-cloud-download
            </v-icon>
          </div>
          <v-progress-linear v-else :value="downloadPercent" />
        </transition>
      </v-btn>
      <v-btn :href="'https://www.twitch.tv/videos/' + clip.video_id" target="_blank" small>
        {{ $t('clips.item.replay') }}<v-icon class="ml-2">
          mdi-movie-outline
        </v-icon>
      </v-btn>
      <video-player :active="active" :slug="clip.id" :autoplay="true" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

import VideoPlayer from '../utils/VideoPlayer'

export default {
  components: {
    VideoPlayer
  },
  props: {
    clip: { type: Object, default: () => {} },
    active: { type: Boolean, default: false }
  },
  data () {
    return {
      loading: false,
      total: 0,
      loaded: 0
    }
  },
  computed: {
    slug () {
      let str = this.clip.title
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
    },
    downloadPercent () {
      return (this.loaded / this.total) * 100
    }
  },
  methods: {
    format (value) {
      return moment(value).format('DD/MM/YYYY hh:mm')
    },
    async downloadAndRename (url, name) {
      this.loading = true
      const self = this
      const { data } = await axios.get('https://cors-anywhere.herokuapp.com/' + url, {
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob',
        onDownloadProgress (progressEvent) {
          self.loaded = progressEvent.loaded
          self.total = progressEvent.total
        }
      })
      const a = document.createElement('a')
      const link = window.URL.createObjectURL(data)
      a.href = link
      a.download = this.slug + '.mp4'
      a.click()
      this.loading = false
    },
    slugify (str) {

    }
  }
}
</script>

<style lang="scss" scoped>
  .v-expansion-panel:hover,
  .v-expansion-panel--active {
    background-color: #525252 !important;
  }

  .download-btn {
    min-width: 155px !important;
    transition: all ease .5s;
  }
</style>
