<template>
  <div>
    <v-navigation-drawer v-model="drawer" :right="true" class="playersidebar" app>
      <v-list dense nav class="py-0">
        <v-list-item class="px-2" two-line>
          <h1 class="mx-auto">
            <span class="indigo--text text--accent-2">R</span><span class="grey--text text--lighten-2 font-weight-thin">eplaySync</span>
          </h1>
          <v-icon @click="drawer = false" class="menu-icon">
            mdi-arrow-right
          </v-icon>
        </v-list-item>
        <v-divider />
      </v-list>
      <p class="text-center mt-4 mb-3 overline">
        Player controls
      </p>
      <div class="text-center">
        <v-btn :disabled="!canPlay" @click="$store.commit('player/SET_GLOBAL_STATE', 'playing')" fab>
          <v-icon>mdi-play</v-icon>
        </v-btn>
        <v-btn :disabled="!canPause" @click="$store.commit('player/SET_GLOBAL_STATE', 'paused')" fab>
          <v-icon>mdi-pause</v-icon>
        </v-btn>
        <v-btn :disabled="!canSync" @click="$store.dispatch('player/sync', canPlay ? 'paused' : 'playing')" fab>
          <v-icon>mdi-sync</v-icon>
        </v-btn>
      </div>
      <v-slider v-model="volume" append-icon="mdi-volume-high" prepend-icon="mdi-volume-low" class="mx-2 my-4" />
      <p class="text-center mt-4 mb-3 overline">
        Reference controls
      </p>
      <v-list dense nav class="px-4">
        <v-list-item
          v-for="channel in channels"
          :key="channel.id"
          :class="{'selected-channel-card': $store.getters['player/isRef'](channel.id)}"
          @click="$store.commit('player/SET_REFERENCE_SLOT', channel.id)"
          class="channel-card d-flex align-center pa-3"
        >
          <v-avatar class="avatar">
            <img :src="channel.picture">
          </v-avatar>
          <div>
            <p class="ma-0 pl-4">
              {{ channel.name.charAt(0).toUpperCase() + channel.name.slice(1) }}
            </p>
            <p :class="slotStatusClass($store.getters['player/slotStatus'](channel.id))" class="ma-0 pl-4 slot-status overline">
              {{ $store.getters['player/slotStatus'](channel.id) }}
            </p>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <transition>
      <v-btn @click="drawer = true" :class="{show: !drawer}" fab class="trigger">
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </transition>
  </div>
</template>

<script>

export default {
  components: {},
  data () {
    return {
      drawer: true
    }
  },
  computed: {
    channels () {
      return this.$store.getters['player/channels']
    },
    referenceSlot () {
      return this.$store.getters['player/referenceSlot']
    },
    ready () {
      return this.$store.getters['player/allPlayersReady']
    },
    canPlay () {
      return (this.$store.state.player.globalState === 'init' || this.$store.state.player.globalState === 'paused') && this.ready
    },
    canPause () {
      return (!this.$store.state.player.globalState === 'init' || this.$store.state.player.globalState === 'playing') && this.ready
    },
    canSync () {
      return this.$store.state.player.globalState !== 'init'
    },
    volume: {
      get () {
        return this.$store.state.player.volume * 100
      },
      set (value) {
        this.$store.commit('player/SET_VOLUME', value === 0 ? 0.01 : parseFloat(value / 100))
      }
    }
  },
  watch: {
    ready (newValue, oldValue) {
      if (this.$store.state.player.globalState === 'playing' && !newValue) {
        this.$store.commit('player/SET_GLOBAL_STATE', 'paused')
      }
    }
  },
  methods: {
    slotStatusClass (status) {
      if (status === 'idle' || status === 'ended') return 'red--text text--lighten-2'
      else if (status === 'reference') return 'blue--text text--lighten-2'
      else if (status === 'running') return 'green--text text--lighten-2'
    }
  }
}
</script>

<style lang="scss" scoped>
.trigger {
  position: fixed;
  top: 2px;
  right: 2px;
  z-index: 10;
  transform: translateX(100px);
  &.show {
    transform: translateX(0px);
  }
}

.playersidebar {
  z-index: 11;
  .menu-icon {
    position: absolute;
    right: 0;
  }
  .channel-card {
    background: #272727;
    cursor: pointer;
    transition: all .2s;

    &.selected-channel-card {
      background: #6b6b6b;
    }
    &:hover:not(.selected-channel-card) {
      background: #4e4c4c;
    }
    .slot-status {
      text-transform: capitalize;
    }
  }
}
</style>
