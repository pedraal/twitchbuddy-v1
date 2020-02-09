<template>
  <div>
    <div :style="gridTemplate" class="grid">
      <div
        v-for="(collection, id) in collections"
        :key="id"
        :id="'player-'+(id+1)"
      >
        <client-only>
          <TwitchPlayer :video="collection.collection[0]" :ref="id" class="grid-item" />
        </client-only>
      </div>
    </div>
    <div class="controler">
      <!-- <v-select
        :items="collections.map(collection => collection.collection.map(video => video.title))"
        label="Outlined style"
        outlined
        dense
        style="width:240px;"
      /> -->
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
      if (this.collections.length >= 4) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"player1 player2" "player3 player4"'

        }
      }
      if (this.collections.length >= 3) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"player1 player2" "player3 player3"'
        }
      }
      if (this.collections.length === 2) {
        return {
          gridTemplateColumns: '100%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"player1" "player2"'

        }
      }
      return {
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto',
        gridTemplateAreas: '"player1"'

      }
    }
  },
  mounted () {
    if (this.collections.length === 0) {
      window.location = '/replaysync'
    }

    window.appInterval = setInterval(() => {
      this.$replayBus.$emit('ping')
    }, 1000)
  },
  beforeDestroy () {
    window.appInterval = null
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

#player-1{
  grid-area: player1
}
#player-2{
  grid-area: player2
}
#player-3{
  grid-area: player3
}
#player-4{
  grid-area: player4
}

</style>
