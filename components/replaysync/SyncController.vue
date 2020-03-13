<template>
  <div @mouseenter="trigger=true" @mouseleave="trigger=false" class="controllers">
    <transition-group mode="out-in" name="trigger">
      <div key="trigger" v-show="!trigger" class="trigger">
        <v-btn fab>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
      <player-commands key="player-commands" :playerState="playerState" v-show="trigger" />
      <ref-commands key="ref-commands" v-show="trigger" />
    </transition-group>
  </div>
</template>

<script>
import PlayerCommands from './PlayerCommands'
import RefCommands from './RefCommands'
export default {
  components: {
    PlayerCommands,
    RefCommands
  },
  data () {
    return {
      playerState: 'paused',
      trigger: true
    }
  },
  mounted () {
    window.appClock = setInterval(() => {
      this.$replayBus.$emit('ping')
    }, 1000)

    this.$replayBus.$on('sync', () => { this.handleSync() })

    this.$replayBus.$on('main-action', () => {
      if (this.playerState === 'playing') {
        this.$replayBus.$emit('pause')
        this.playerState = 'paused'
      } else if (this.playerState === 'paused') {
        this.$replayBus.$emit('play')
        this.playerState = 'playing'
      }
    })
  },
  beforeDestroy () {
    clearInterval(window.appClock)
    window.appClock = null
    this.$replayBus.$off('sync')
    this.$replayBus.$off('main-action')
  },
  methods: {
    handleSync () {
      this.$emit('loading')
      this.state = 'paused'
      setTimeout(() => {
        this.$replayBus.$emit('play')
        this.state = 'playing'
        this.$emit('ready')
      }, 2500)
    }
  }
}
</script>

<style lang="scss" scoped>
  .trigger{
    position: absolute;
    top: 10px;
    right: 10px;
  }
</style>
