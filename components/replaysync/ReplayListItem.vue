<template>
  <v-card
    @click="add()"
    :class="{'selected-video': isSelected} "
    class="my-2 py-2 pl-2 pr-6 d-flex align-center"
    max-width="100%"
    outlined
  >
    <v-avatar class="avatar mr-2">
      <img :src="picture">
    </v-avatar>
    <div class="replay-info">
      <h5 class="caption">
        {{ video.title }}
      </h5>
      <p class="overline my-0">
        <v-icon small>
          mdi-ray-start
        </v-icon>
        &nbsp;{{ humanTime(video.created_at) }}
      </p>
      <p class="overline my-0">
        <v-icon small>
          mdi-ray-end
        </v-icon>
        &nbsp;{{ humanTime(video.ended_at) }}
      </p>
      <p class="overline my-0">
        <v-icon small>
          mdi-clock
        </v-icon>
        &nbsp;{{ video.duration }}
      </p>
    </div>
    <div v-if="isSelected" @click.stop="remove" class="close">
      <v-icon class="body-1">
        mdi-close
      </v-icon>
    </div>
  </v-card>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    video: {
      type: Object,
      required: true
    },
    picture: {
      type: String,
      default: ''
    }
  },
  computed: {
    isSelected () {
      return this.$store.state.videos.selectedVideos.find(v => v.video.id === this.video.id)
    },
    channelIsAlreadySelected () {
      return !this.isSelected && this.$store.state.videos.selectedVideos.find(v => v.id === this.video.collectionId)
    }
  },
  methods: {
    humanDate (val) {
      return moment(val).format('DD-MM-YYYY')
    },
    humanTime (val) {
      return moment(val).format('HH:mm:ss')
    },
    add () {
      if (this.channelIsAlreadySelected) {
        this.$store.commit('videos/REMOVE_SELECTED_VIDEO', this.channelIsAlreadySelected.video.id)
        this.$store.commit('videos/ADD_SELECTED_VIDEO', this.video)
      } else if (!this.isSelected) this.$store.commit('videos/ADD_SELECTED_VIDEO', this.video)
    },
    remove () {
      this.$store.commit('videos/REMOVE_SELECTED_VIDEO', this.video.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .v-card {
    .replay-info, .avatar {
      min-width: 0;
    }
    h5 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &.selected-video{
      background: #474747;
    }
    .avatar {
      border-radius: 50% !important;
    }
    .close {
      position: absolute;
      top: 0px;
      right: 2px;
    }
  }
  .v-card--link:focus:before{
    opacity: 0;
  }
</style>
