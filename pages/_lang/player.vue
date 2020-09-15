<template>
  <v-app>
    <PlayerSidebar />
    <v-main>
      <div :style="gridTemplate" class="player-grid grey darken-4">
        <div
          v-for="(slot, id) in slots"
          :key="slot.id"
          :id="'gridItem-'+(id+1)"
        >
          <TwitchPlayer
            :slotData="slot"
            :ref="`slot-${slot.id}`"
            class="grid-item"
          />
        </div>
      </div>
      <transition name="fade">
        <div v-if="!$store.getters['player/allPlayersReady'] || $store.state.player.globalState === 'sync'" class="loader d-flex justify-center align-center">
          <v-progress-circular
            :size="150"
            color="primary"
            indeterminate
          />
        </div>
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import TwitchPlayer from '@/components/player/TwitchPlayer'
import PlayerSidebar from '@/components/player/PlayerSidebar'

export default {
  name: 'AppPlayer',
  components: {
    TwitchPlayer,
    PlayerSidebar
  },
  layout: 'player',
  data () {
    return {
      init: true
    }
  },
  computed: {
    slots () {
      return this.$store.state.player.slots
    },
    globalState () {
      return this.$store.state.player.globalState
    },
    allPlayersPlaying () {
      return this.$store.getters['player/allPlayersPlaying']
    },
    gridTemplate () {
      if (this.slots.length >= 4) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1 gridItem2" "gridItem3 gridItem4"'
        }
      }
      if (this.slots.length >= 3) {
        return {
          gridTemplateColumns: '50% 50%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1 gridItem2" "gridItem3 gridItem3"'
        }
      }
      if (this.slots.length === 2) {
        return {
          gridTemplateColumns: '100%',
          gridTemplateRows: '50%',
          gridTemplateAreas: '"gridItem1" "gridItem2"'
        }
      }
      return {
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'auto',
        gridTemplateAreas: '"gridItem1"'
      }
    }
  },
  watch: {
    allPlayersPlaying (newValue, oldValue) {
      if (newValue && this.init && !this.$store.state.autoSync) {
        this.$store.dispatch('player/sync', 'playing')
        this.init = false
      }
    }
  },
  mounted () {
    if (this.$store.state.player.referenceSlot === '') {
      this.$router.replace(this.$store.state.locale === 'en' ? '/en/replaysync' : '/replaysync')
    }
    this.$store.commit('player/SOFT_RESET_PLAYER')
  }
}
</script>

<style lang="scss" scoped>
.player-grid {
  height: 100vh;
  width: 100%;
  display: grid;

    #gridItem-1 {
      grid-area: gridItem1;
    }

    #gridItem-2 {
      grid-area: gridItem2;
    }

    #gridItem-3 {
      grid-area: gridItem3;
    }

    #gridItem-4 {
      grid-area: gridItem4;
    }
  }

.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100vh;
  background-color: rgba(grey, 0.7);
}

</style>
