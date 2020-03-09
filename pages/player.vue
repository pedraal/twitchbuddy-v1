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
    <sync-controller />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TwitchPlayer from '@/components/replaysync/TwitchPlayer'
import SyncController from '@/components/replaysync/SyncController'

export default {
  layout: 'player',
  components: {
    TwitchPlayer,
    SyncController
  },

  computed: {
    ...mapGetters('videos', ['collections', 'hasSelection']),
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
    if (!this.hasSelection) {
      window.location = '/replaysync'
    }
  }

}
</script>

<style lang="scss" scoped>
.grid{
  height: 100vh;
  width: 100%;
  display: grid;
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
