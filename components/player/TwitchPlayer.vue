<template>
  <div class="wrapper">
    <div ref="player" class="wrapper" />
  </div>
</template>

<script>
const players = {}
const timers = {}

export default {
  props: {
    slotData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isReference () {
      return this.$store.getters['player/isRef'](this.slotData.id)
    },
    slotStatus () {
      return this.$store.getters['player/slotStatus'](this.slotData.id)
    },
    globalState () {
      return this.$store.state.player.globalState
    },
    volume () {
      return this.$store.state.player.volume
    },
    quality () {
      return this.$store.state.player.quality
    },
    expectedTimestamp () {
      return this.$store.getters['player/calculateExpectedTimestamp'](this.slotData.id)
    },
    syncStatus () {
      return this.$store.getters['player/slotSyncStatus'](this.slotData.id)
    },
    allPlaying () {
      return this.$store.getters['player/allPlayersPlaying']
    }

  },
  watch: {
    isReference (val) {
      val ? this.unmute() : this.mute()
    },
    slotStatus (newState, oldState) {
      if (oldState === 'idle' && newState === 'running') {
        this.play()
      } else if (newState === 'ended' || newState === 'not-started') {
        this.pause()
        this.seek(0)
      }
    },
    globalState (newState, oldState) {
      if (newState === 'playing' && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.play()
      } else if (newState === 'paused' && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.pause()
      } else if ((newState === 'sync') && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.pause()
        if (this.slotStatus !== 'reference') this.seek(this.expectedTimestamp)
        if (this.slotStatus === 'reference') this.seek(this.slotData.video.timestamp)
      }
    },
    volume (newVolume) {
      players[this.slotData.id].setVolume(newVolume)
    },
    quality (newQuality) {
      players[this.slotData.id].setQuality(newQuality)
    }
  },
  beforeMount () {
    this.$unloadScript('https://player.twitch.tv/js/embed/v1.js')
    this.$loadScript('https://player.twitch.tv/js/embed/v1.js')
      .then(() => {
        const options = {
          width: '100%',
          height: '100%',
          video: this.slotData.video.id,
          autoplay: false,
          parent: [window.location.host.includes('localhost') ? 'localhost' : window.location.host]
        }

        players[this.slotData.id] = new window.Twitch.Player(this.$refs.player, options)
        players[this.slotData.id].addEventListener('ended', () => (this.$emit('ended')))
        players[this.slotData.id].addEventListener('pause', () => (this.$emit('pause', this.slotData.id)))
        players[this.slotData.id].addEventListener('play', () => { this.$emit('play', this.slotData.id) })
        players[this.slotData.id].addEventListener('offline', () => (this.$emit('offline')))
        players[this.slotData.id].addEventListener('online', () => (this.$emit('online')))
        players[this.slotData.id].addEventListener('ready', () => {
          players[this.slotData.id].setQuality(this.quality)
          players[this.slotData.id].setVolume(this.volume)
          this.isReference ? this.unmute() : this.mute()
          this.$emit('ready', this.slotData.id)
        })
      }).catch(e => (this.$emit('error', e)))
  },
  mounted () {
    const self = this
    timers[this.slotData.id] = setInterval(() => {
      if (self.globalState === 'playing') {
        self.$store.commit('player/SET_VIDEO_TIMESTAMP', { id: self.slotData.id, timestamp: Math.trunc(self.getCurrentTime()) })
      }
      if (this.allPlaying && this.$store.state.player.autoSync && this.$store.state.player.canAutoSync && this.syncStatus !== 'good') {
        this.$store.dispatch('player/sync', 'playing')
      }
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(timers[this.slotData.id])
  },
  methods: {
    play () {
      players[this.slotData.id].play()
    },
    pause () {
      players[this.slotData.id].pause()
    },
    seek (timestamp) {
      players[this.slotData.id].seek(timestamp)
    },
    getCurrentTime () {
      return players[this.slotData.id].getCurrentTime()
    },
    mute () {
      players[this.slotData.id].setMuted(true)
    },
    unmute () {
      players[this.slotData.id].setMuted(false)
    },
    isPaused () {
      return players[this.slotData.id].isPaused()
    },
    hasEnded () {
      return players[this.slotData.id].getEnded()
    },
    getVolume () {
      return players[this.slotData.id].getVolume()
    },
    isMuted () {
      return players[this.slotData.id].getMuted()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  height: 100%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

</style>
