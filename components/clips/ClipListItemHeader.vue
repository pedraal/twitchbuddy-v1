<template>
  <div>
    <v-expansion-panel-header hide-actions class="text-right">
      <v-progress-linear v-if="loading" :value="downloadPercent" class="download-bar" />
      <template v-if="!active">
        <div class="flex-grow-0 d-none d-sm-block mr-4">
          <transition name="fade" mode="out-in">
            <v-img :src="clip.thumbnail_url" height="65px" width="115px" contain />
          </transition>
        </div>
        <div class="text-truncate">
          <p class="caption text-left mb-2 text-truncate ">
            {{ clip.category }}
          </p>
          <p class="text-left mb-0 text-truncate ">
            {{ clip.title }}
          </p>
        </div>
        <div class="text-right d-none d-sm-block mr-8 flex-grow-0" style="min-width: 100px;">
          <p class="caption mb-2">
            {{ clip.view_count }} {{ $t('clips.item.views') }}
          </p>
          <p class="caption mb-0 text-truncate">
            {{ $t('clips.item.by') }} {{ clip.creator_name }}
          </p>
        </div>
        <div class="text-center text-sm-right d-none d-sm-block flex-grow-0" style="min-width: 110px;">
          <p class="caption mb-2">
            {{ $t('clips.item.createdAt') }}
          </p>
          <p class="caption mb-0">
            {{ createdAt }}
          </p>
        </div>
        <div class="text-right d-block d-sm-none caption" style="min-width: 110px;">
          <p class="mb-2">
            {{ clip.view_count }} {{ $t('clips.item.views') }}
          </p>
          <p class="mb-0">
            {{ createdAt }}
          </p>
        </div>
      </template>
      <template v-else>
        <v-spacer />
        <div class="flex-grow-0">
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
                v-bind="attrs"
                v-on="on"
                v-if="!loading"
                @click.stop="download"
                :class="{loading}"
                class="download-btn"
                small
              >
                <v-icon>
                  mdi-cloud-download
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('clips.item.download') }}</span>
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
          <AddToListsButton v-if="$store.state.api.user" :clip="clip" class="d-inline-block" />
          <v-tooltip v-if="deletable" top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                @click.stop="$store.dispatch('lists/removeClip', index)"
                v-bind="attrs"
                v-on="on"
                small
              >
                <v-icon>
                  mdi-playlist-remove
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t('clips.item.removeList') }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-expansion-panel-header>
  </div>
</template>

<script>
import clipDownloader from '@/utils/clip-downloader'
import moment from 'moment'

import AddToListsButton from './AddToListsButton'

export default {

  components: {
    AddToListsButton
  },
  props: {
    clip: { type: Object, default: () => {} },
    active: { type: Boolean, default: false },
    deletable: { type: Boolean, default: false },
    index: { type: Number, required: true }
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
    downloadPercent () {
      return (this.loaded / this.total) * 100
    }
  },
  mounted () {
    this.$nuxt.$on('downloadAll', this.download)
  },
  beforeDestroy () {
    this.$nuxt.$off('downloadAll', this.download)
  },
  methods: {
    async download () {
      if (this.loading) return
      this.loading = true
      await clipDownloader(this.clip, (event) => {
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
    width: 100%;
    min-height: 90px;
    position: relative;
    overflow: hidden;
  }

  .download-btn {
    width: auto;
    transition: all ease .5s;
    &.loading {
    width: 155px !important;
    }
  }

  .download-bar {
    position: absolute;
    width: 100%;
    top: 1px;
    left: 0;
  }
</style>
