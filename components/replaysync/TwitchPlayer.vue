<template>
  <div class="wrapper">
    <div :ref="video.id" class="wrapper" />
    <div @mouseenter="tooltip = true" @mouseleave="tooltip = false" class="status">
      <div v-if="isReference">
        <v-icon class="blue--text text--lighten-2">
          mdi-checkbox-blank-circle
        </v-icon>
        <transition name="trigger">
          <span v-show="tooltip" class="blue--text text--lighten-2 font-weight-bold">&nbsp;Reference</span>
        </transition>
      </div>
      <div v-else-if="videoState === 'idle'">
        <v-icon class="red--text text--lighten-2">
          mdi-checkbox-blank-circle
        </v-icon>
        <transition name="trigger">
          <span v-show="tooltip" class="red--text text--lighten-2 font-weight-bold">&nbsp;Not started</span>
        </transition>
      </div>
      <div v-else-if="videoState === 'ended'">
        <v-icon class="red--text text--lighten-2">
          mdi-checkbox-blank-circle
        </v-icon>
        <transition name="trigger">
          <span v-show="tooltip" class="red--text text--lighten-2 font-weight-bold">&nbsp;Ended</span>
        </transition>
      </div>
      <div v-else>
        <v-icon class="green--text text--lighten-2">
          mdi-checkbox-blank-circle
        </v-icon>
        <transition name="trigger">
          <span v-show="tooltip" class="green--text text--lighten-2 font-weight-bold">&nbsp;Running</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  props: {
    video: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      player: null,
      videoState: 'init',
      tooltip: false
    }
  },
  computed: {
    ...mapGetters('videos', ['selectedVideo', 'selectedVideoTimestamp']),
    isReference () {
      return this.video.id === this.selectedVideo.id
    }
  },
  watch: {
    isReference (val) {
      val ? this.unmute() : this.mute()
    },
    videoState (newState, oldState) {
      if (oldState === 'idle' && newState === 'running') {
        this.$replayBus.$emit('sync')
      }
    }
  },
  beforeMount () {
    this.$unloadScript('https://player.twitch.tv/js/embed/v1.js')
    this.$loadScript('https://player.twitch.tv/js/embed/v1.js')
      .then(() => {
        const options = {
          width: '100%',
          height: '100%',
          video: this.video.id,
          autoplay: false
        }

        this.player = new window.Twitch.Player(this.$refs[this.video.id], options)
        this.player.addEventListener('ready', () => { this.handleReady() })
      }).catch(e => (this.$emit('error', e)))
  },
  mounted () {
    this.$replayBus.$on('play', this.play)
    this.$replayBus.$on('pause', this.pause)
    this.$replayBus.$on('sync', this.handleSync)
    this.$replayBus.$on('ping', this.handlePing)
  },
  beforeDestroy () {
    this.player.removeEventListener('ready', () => { this.handleReady() })
    this.$replayBus.$off('play')
    this.$replayBus.$off('pause')
    this.$replayBus.$off('sync')
    this.$replayBus.$off('ping')
  },
  methods: {
    ...mapActions('videos', ['setSelectedVideoTimestamp']),
    handleReady () {
      this.player.setQuality('480p30')
      this.setVolume(1)
      this.isReference ? this.unmute() : this.mute()
      this.$emit('ready')
    },
    handlePing () {
      if (this.isReference) {
        this.setSelectedVideoTimestamp(this.getCurrentTime())
        this.videoState = 'reference'
      } else {
        const offset = this.selectedVideoTimestamp - moment(this.video.created_at).diff(moment(this.selectedVideo.created_at), 'seconds', true)
        if (offset <= 0) {
          this.videoState = 'idle'
        } else if (moment(this.video.created_at).add(offset, 'seconds').isAfter(moment(this.video.ended_at))) {
          this.videoState = 'ended'
        } else {
          this.videoState = 'running'
        }
      }
    },
    handleSync () {
      this.pause()
      if (this.isReference) return
      const offset = moment(this.video.created_at).diff(moment(this.selectedVideo.created_at), 'seconds', true)
      this.seek(this.selectedVideoTimestamp - offset)
    },
    play () {
      if (this.videoState !== 'idle' && this.videoState !== 'ended') {
        this.player.play()
      }
    },
    pause () {
      this.player.pause()
    },
    seek (timestamp) {
      this.player.seek(timestamp)
    },
    setVolume (val) {
      this.player.setVolume(val)
    },
    getCurrentTime () {
      return this.player.getCurrentTime()
    },
    mute () {
      this.player.setMuted(true)
    },
    unmute () {
      this.player.setMuted(false)
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

  .status {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 100%;

    span {
      text-shadow: 2px 2px black;
    }
  }
}

</style>
