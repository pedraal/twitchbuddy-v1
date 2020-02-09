<template>
  <div class="wrapper">
    <div :ref="video.id" class="wrapper" />
    <div class="status">
      <div v-if="video.id === selectedVideo.id" class="blue--text text--lighten-2 font-weight-bold">
        Reference
      </div>
      <div v-else-if="notStarted" class="red--text text--lighten-2 font-weight-bold">
        Not started yet
      </div>
      <div v-else-if="ended" class="red--text text--lighten-2 font-weight-bold">
        Ended
      </div>
      <div v-else class="green--text text--lighten-2 font-weight-bold">
        Running
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
      notStarted: false,
      ended: false
    }
  },
  computed: {
    ...mapGetters('videos', ['selectedVideo', 'selectedVideoTimestamp'])

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
        this.player.addEventListener('ended', () => (this.$emit('ended')))
        this.player.addEventListener('pause', () => (this.$emit('pause')))
        this.player.addEventListener('play', () => (this.$emit('play')))
        this.player.addEventListener('offline', () => (this.$emit('offline')))
        this.player.addEventListener('online', () => (this.$emit('online')))
        this.player.addEventListener('ready', () => {
          this.player.setQuality('480p30')
          this.player.setVolume(1)
          this.$emit('ready')
          this.seek(0)
        })
      }).catch(e => (this.$emit('error', e)))
  },
  mounted () {
    this.$replayBus.$on('play', () => {
      this.play()
    })
    this.$replayBus.$on('pause', () => {
      this.pause()
    })
    this.$replayBus.$on('sync', (event) => {
      if (this.video.id !== this.selectedVideo.id) this.sync(event)
    })
    this.$replayBus.$on('ping', () => {
      if (this.video.id === this.selectedVideo.id) this.setSelectedVideoTimestamp(this.getCurrentTime())
      else {
        const offset = this.selectedVideoTimestamp - moment(this.video.created_at).diff(moment(this.selectedVideo.created_at), 'seconds', true)
        this.notStarted = offset <= 0
        this.ended = moment(this.video.created_at).add(offset, 'seconds').isAfter(moment(this.video.ended_at))
      }
    })
  },
  methods: {
    ...mapActions('videos', ['setSelectedVideoTimestamp']),
    play () {
      this.player.play()
    },
    sync () {
      const offset = moment(this.video.created_at).diff(moment(this.selectedVideo.created_at), 'seconds', true)
      this.seek(this.selectedVideoTimestamp - offset)
      this.notStarted = offset < 0
      this.ended = moment(this.video.created_at).add(offset, 'seconds').isAfter(moment(this.video.ended_at))
    },
    pause () {
      this.player.pause()
    },
    seek (timestamp) {
      this.player.seek(timestamp)
    },
    getCurrentTime () {
      return this.player.getCurrentTime()
    },
    getDuration () {
      return this.player.getDuration()
    },
    getPlaybackStats () {
      return this.player.getPlaybackStats()
    },
    getQuality () {
      return this.player.getQuality()
    },
    isPaused () {
      return this.player.isPaused()
    },
    hasEnded () {
      return this.player.getEnded()
    },
    getVolume () {
      return this.player.getVolume()
    },
    isMuted () {
      return this.player.getMuted()
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

  iframe{
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
  }
}

</style>
