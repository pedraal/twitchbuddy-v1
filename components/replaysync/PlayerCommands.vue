<template>
  <div class="controler">
    <v-btn @click="$replayBus.$emit('main-action')" fab small>
      <v-icon v-if="playerState === 'playing'">
        mdi-pause
      </v-icon>
      <v-icon v-if="playerState === 'paused'">
        mdi-play
      </v-icon>
    </v-btn>
    <v-btn @click="$replayBus.$emit('sync', selectedVideo)" fab small>
      <v-icon>mdi-sync</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    playerState: {
      type: String,
      default: 'paused'
    }
  },
  computed: {
    ...mapGetters('videos', ['selectedVideo'])
  }
}
</script>

<style lang="scss" scoped>
  .controler {
    display: inline-block;
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
