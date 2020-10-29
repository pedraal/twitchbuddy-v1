<template>
  <v-expansion-panel>
    <ClipListItemHeader :clip="clip" :active="active" :deletable="deletable" :index="index" />
    <v-expansion-panel-content class="px-sm-1">
      <div class="d-block d-md-flex justify-center align-center">
        <video-player :active="active" :slug="clip.id" :autoplay="true" class="flex-grow-1 mr-md-4 mb-3 mb-md-0 clip-embed" />
        <div class="clip-info">
          <v-card class="pa-2 mb-2 clip-info-item">
            <p class="caption mb-0">
              {{ $t('clips.item.labels.title') }}
            </p>
            <p class="text-truncate overline my-0 my-mb-2 text-center">
              {{ clip.title }}
            </p>
          </v-card>
          <v-row>
            <v-col cols="12" sm="6" class="py-1 py-sm-2">
              <v-card class="pa-2 ma-0 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.category') }}
                </p>
                <p class="text-truncate overline my-0 my-mb-2 text-center">
                  {{ clip.category }}
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" class="py-1 py-sm-2">
              <v-card class="pa-2 ma-0 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.views') }}
                </p>
                <p class="overline my-0 my-mb-2 text-center">
                  {{ clip.view_count }} <v-icon size="medium">
                    mdi-eye
                  </v-icon>
                </p>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6" class="py-1 py-sm-2">
              <v-card class="pa-2 ma-0 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.createdAt') }}
                </p>
                <p class="overline my-0 my-mb-2 text-center">
                  {{ createdAt }}
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" class="py-1 py-sm-2">
              <v-card class="pa-2 ma-0 clip-info-item">
                <p class="caption mb-0">
                  {{ $t('clips.item.labels.by') }}
                </p>
                <p class="overline my-0 my-mb-2 text-center">
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

import VideoPlayer from '../utils/VideoPlayer'
import ClipListItemHeader from './ClipListItemHeader'

export default {
  components: {
    VideoPlayer,
    ClipListItemHeader
  },
  props: {
    clip: { type: Object, default: () => {} },
    active: { type: Boolean, default: false },
    deletable: { type: Boolean, default: false },
    index: { type: Number, required: true }
  },
  computed: {
    createdAt () {
      return moment(this.clip.created_at).format('DD/MM/YYYY hh:mm')
    }
  }
}
</script>

<style lang="scss" scoped>
  .clip-info {
    width: 50%;
  }

  .clip-info-item,
  .clip-embed {
    border: 1px solid #424242 !important;
    border-radius: 8px;
  }

  .clip-embed {
    max-width: 500px;
    margin: 0 auto;
  }

  @media screen and (max-width: 960px){
    .clip-info {
      width: 100%;
    }
  }
</style>
