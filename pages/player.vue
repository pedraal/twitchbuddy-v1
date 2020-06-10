<template>
  <v-app>
    <PlayerSidebar />
    <v-content>
      <div :style="gridTemplate" class="player-grid grey darken-4">
        <div
          v-for="(slot, id) in slots"
          :key="slot.id"
          :id="'gridItem-'+(id+1)"
        >
          <TwitchPlayer
            :slotData="slot"
            :ref="`slot-${slot.id}`"
            @ready="setSlotReady"
            @play="setSlotPlaying"
            @pause="setSlotPaused"
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
    </v-content>
  </v-app>
</template>

<script>
import TwitchPlayer from '@/components/replaysync/TwitchPlayer'
import PlayerSidebar from '@/components/replaysync/PlayerSidebar'

import gridTemplate from '@/mixins/gridTemplateMixin.js'

export default {
  name: 'AppPlayer',
  components: {
    TwitchPlayer,
    PlayerSidebar
  },
  mixins: [gridTemplate],
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
    allPlayerPlaying () {
      return this.$store.getters['player/allPlayersPlaying']
    }
  },
  watch: {
    // globalState (newValue, oldValue) {
    //   if (oldValue === 'init' && newValue === 'playing') {

    //   }
    // },
    allPlayerPlaying (newValue, oldValue) {
      if (newValue && this.init && !this.$store.state.autoSync) {
        // setTimeout(() => {
        this.$store.dispatch('player/sync', 'playing')
        // }, 2000)
        this.init = false
      }
    }
  },
  created () {
    if (this.$store.state.player.referenceSlot === '') {
      this.$router.push('replaysync')
    }
    this.$store.commit('player/SOFT_RESET_PLAYER')
  },
  methods: {
    setSlotReady (payload) {
      this.$store.commit('player/SET_VIDEO_STATE', { id: payload, state: 'ready' })
    },
    setSlotPlaying (payload) {
      this.$store.commit('player/SET_VIDEO_STATE', { id: payload, state: 'playing' })
    },
    setSlotPaused (payload) {
      this.$store.commit('player/SET_VIDEO_STATE', { id: payload, state: 'paused' })
    }
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
