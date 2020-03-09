<template>
  <div class="controler">
    <v-btn @click="$replayBus.$emit('play')">
      Play
    </v-btn>
    <v-btn @click="$replayBus.$emit('sync', selectedVideo)">
      Sync
    </v-btn>
    <v-btn @click="$replayBus.$emit('pause')">
      Pause
    </v-btn>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
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
