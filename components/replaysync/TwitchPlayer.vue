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
    expected () {
      return this.$store.getters['player/calcExpected'](this.slotData.id)
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
      }
    },
    globalState (newState, oldState) {
      if (newState === 'playing' && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.play()
      } else if (newState === 'paused' && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.pause()
      } else if ((newState === 'sync') && (this.slotStatus === 'running' || this.slotStatus === 'reference')) {
        this.pause()
        if (this.slotStatus !== 'reference') this.seek(this.expected)
        if (this.slotStatus === 'reference') this.seek(this.slotData.video.timestamp)
      }

      // if (oldState === 'init' && this.slotStatus !== 'reference') {
      // setTimeout(() => {
      //   this.$store.commit('player/SET_VIDEO_STATE', { id: this.slotData.id, state: 'sync' })
      // }, 2000)
      // }
    },
    // allPlaying (newValue, oldValue) {
    //   if (newValue && this.$store.state.player.autoSync && this.$store.state.player.canAutoSync && this.syncStatus !== 'good') {
    //     this.$store.dispatch('player/sync', 'playing')
    //   }
    // },
    // '$store.state.player.autoSync' (newValue) {
    //   if (newValue && this.syncStatus === 'ok' && this.$store.state.player.canAutoSync && this.$store.state.player.globalState === 'playing') {
    //     this.$store.dispatch('player/sync', 'playing')
    //   }
    // },
    // video (newVideo) {
    //   player.setVideo(newVideo)
    // },
    // 'slotData.video.state' (newState, oldState) {
    //   if (newState === 'sync') {
    //     this.seek(this.expected)
    //     setTimeout(() => {
    //       this.$store.commit('player/SET_VIDEO_STATE', { id: this.slotData.id, state: 'ready' })
    //     // récupérer l'état global pré sync pour remettre play si il faut
    //     }, 2000)
    //   }
    // },
    volume (newVolume) {
      players[this.slotData.id].setVolume(newVolume)
    },
    quality (newQuality) {
      // if (timers[this.slotData.id].getQualities().includes(newQuality)) {
      players[this.slotData.id].setQuality(newQuality)
      // }
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
          autoplay: false
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
    play () { // Begins playing the specified video.
      players[this.slotData.id].play()
    },
    pause () { // Pauses the player.
      players[this.slotData.id].pause()
    },
    seek (timestamp) { // Seeks to the specified timestamp (in seconds) in the video and resumes playing if paused. Does not work for live streams.
      players[this.slotData.id].seek(timestamp)
    },
    getCurrentTime () { // Returns the current video’s timestamp, in seconds. Works only for VODs, not live streams.
      return players[this.slotData.id].getCurrentTime()
    },
    // getDuration () { // Returns the duration of the video, in seconds. Works only for VODs,not live streams.
    //   return player.getDuration()
    // },
    // getPlaybackStats () { // Returns an object with statistics the embedded video player and the current live stream or VOD.
    //   return player.getPlaybackStats()
    // },
    // getQuality () { // Returns the current quality of video playback.
    //   return player.getQuality()
    // },
    isPaused () { // Returns true if the video is paused; otherwise, false. Buffering or seeking is considered playing.
      return players[this.slotData.id].isPaused()
    },
    hasEnded () { // Returns true if the live stream or VOD has ended; otherwise, false.
      return players[this.slotData.id].getEnded()
    },
    getVolume () { // Returns the volume level, a value between 0.0 and 1.0.
      return players[this.slotData.id].getVolume()
    },
    isMuted () { // Returns true if the player is muted; otherwise, false.
      return players[this.slotData.id].getMuted()
    },
    mute () { // Mutes the player.
      players[this.slotData.id].setMuted(true)
    },
    unmute () { // Unmutes the player.
      players[this.slotData.id].setMuted(false)
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
