<template>
  <div>
    <div :style="gridTemplate" class="grid">
      <div
        v-for="(collection, id) in collections"
        :key="id"
      >
        <client-only>
          <TwitchPlayer :video="collection.collection[0]" :ref="id" class="grid-item" />
        </client-only>
      </div>
    </div>
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
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import TwitchPlayer from '@/components/replaysync/TwitchPlayer'

export default {
  layout: 'player',
  components: {
    TwitchPlayer
  },
  computed: {
    ...mapGetters('videos', ['collections', 'selectedVideo']),
    gridTemplate () {
      if (this.collections.length >= 3) {
        return {
          gridTemplateColumns: '50%',
          gridTemplateRows: '50%'
        }
      }
      if (this.collections.length === 2) {
        return {
          gridTemplateColumns: '100%',
          gridTemplateRows: '50%'
        }
      }
      return {
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto'
      }
    }
  },
  mounted () {
    if (this.collections.length === 0) {
      window.location = '/replaysync'
    }

    setInterval(() => {
      this.$replayBus.$emit('ping')
    }, 1000)
  }

}
</script>

<style lang="scss" scoped>
.grid{
  height: 100vh;
  width: 100%;
  display: grid;
}

.controler {
  display: inline-block;
  position: absolute;
  top: 10px;
  right: 10px;
}

</style>
