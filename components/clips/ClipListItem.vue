<template>
  <v-expansion-panel>
    <v-expansion-panel-header hide-actions class="pa-0 px-sm-3">
      <v-row v-if="!active" justify="center" align="center">
        <v-col :class="loading ? 'pl-4 pr-8': 'pr-2'" cols="3" class="pa-0">
          <transition name="fade" mode="out-in">
            <v-img v-if="!loading" :src="clip.thumbnail_url" height="65px" contain />
            <v-progress-linear v-else :value="downloadPercent" />
          </transition>
        </v-col>
        <v-col cols="5" sm="4" class="pa-0">
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
            {{ createdAt }}
          </p>
        </v-col>
        <v-col cols="3" class="text-right pa-0 d-block d-sm-none caption">
          <p class="mb-0">
            {{ clip.view_count }} {{ $t('clips.item.views') }}
          </p>
          <p class="mb-0">
            {{ createdAt }}
          </p>
        </v-col>
      </v-row>
      <div v-else>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              @click.stop="download"
              :class="{loading}"
              class="download-btn"
              small
            >
              <transition name="fade">
                <div v-if="!loading">
                  <v-icon>
                    mdi-cloud-download
                  </v-icon>
                </div>
                <v-progress-linear v-else :value="downloadPercent" />
              </transition>
            </v-btn>
          </template>
          <span>{{ $t('clips.item.download') }}</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :href="'https://www.twitch.tv/videos/' + clip.video_id"
              @click.stop
              v-bind="attrs"
              v-on="on"
              target="_blank"
              small
            >
              <v-icon>
                mdi-movie-outline
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('clips.item.replay') }}</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click.stop="toggleFavorite"
              v-bind="attrs"
              v-on="on"
              small
            >
              <v-icon v-if="!$store.getters['localStorage/isFavorite'](clip.id)">
                mdi-star-outline
              </v-icon>
              <v-icon v-else>
                mdi-star
              </v-icon>
            </v-btn>
          </template>
          <span> {{ $t('clips.item.favorite') }}</span>
        </v-tooltip>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="d-block d-md-flex justify-center align-center">
        <video-player :active="active" :slug="clip.id" :autoplay="true" class="flex-grow-1 mr-md-4 mb-3 mb-md-0 clip-info-item" />
        <div class="clip-info">
          <v-card class="pa-2 pt-2 clip-info-item">
            <p class="caption mb-0">
              {{ $t('clips.item.labels.title') }}
            </p>
            <p class="text-truncate overline my-2 text-center">
              {{ clip.title }}
            </p>
          </v-card>
          <v-row>
            <v-col>
              <v-card class="pa-2 pt-2 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.category') }}
                </p>
                <p class="text-truncate overline my-2 text-center">
                  {{ clip.category }}
                </p>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2 pt-2 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.views') }}
                </p>
                <p class="overline my-2 text-center">
                  {{ clip.view_count }} <v-icon>mdi-eye</v-icon>
                </p>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="pa-2 pt-2 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.createdAt') }}
                </p>
                <p class="overline my-2 text-center">
                  {{ createdAt }}
                </p>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2 pt-2 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.by') }}
                </p>
                <p class="overline my-2 text-center">
                  {{ clip.creator_name }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </div>
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
    createdAt () {
      return moment(this.clip.created_at).format('DD/MM/YYYY hh:mm')
    },
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
    async downloadAndRename (url, name, progressCallback) {
      const { data } = await axios.get('https://cors-anywhere.herokuapp.com/' + url, {
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob',
        onDownloadProgress (progressEvent) {
          progressCallback(progressEvent)
        }
      })
      const a = document.createElement('a')
      const link = window.URL.createObjectURL(data)
      a.href = link
      a.download = this.slug + '.mp4'
      a.click()
    },
    async download () {
      if (this.loading) return
      this.loading = true
      await this.downloadAndRename(this.clip.downloadLink, this.clip.title, (event) => {
        this.loaded = event.loaded
        this.total = event.total
      })
      this.loading = false
    },
    toggleFavorite () {
      if (this.$store.getters['localStorage/isFavorite'](this.clip.id)) this.$store.dispatch('localStorage/removeFavorite', this.clip)
      else this.$store.dispatch('localStorage/addFavorite', this.clip)
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-expansion-panel-header {
    min-height: 90px;
  }

  .download-btn {
    width: auto;
    transition: all ease .5s;
    &.loading {
    width: 155px !important;
    }
  }

  .clip-info {
    width: 40%;
  }

  .clip-info-item {
    border: 1px solid #424242 !important;
    border-radius: 8px;
  }

  @media screen and (max-width: 960px){
    .clip-info {
      width: 100%;
    }
  }
</style>
