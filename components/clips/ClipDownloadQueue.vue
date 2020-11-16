<template>
  <div>
    <v-btn @click="queueDownloads" small outlined color="grey">
      {{ $t('clips.download_queue') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    clips: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      downloadQueue: [],
      batchSize: 10
    }
  },
  mounted () {
    this.$nuxt.$on('clipDownloadEnded', () => {
      if (this.downloadQueue.length === 0) return

      const clipToDownload = this.downloadQueue.shift()
      this.$nuxt.$emit('downloadClip', clipToDownload)
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('clipDownloadEnded', () => {
      if (this.downloadQueue.length === 0) return

      const clipToDownload = this.downloadQueue.shift()
      this.$nuxt.$emit('downloadClip', clipToDownload)
    })
  },
  methods: {
    queueDownloads () {
      const consent = confirm(this.$t('clips.download_queue_confirm'))
      if (!consent) return
      this.downloadQueue = this.clips.map(clip => clip.id)

      const initialBatch = this.downloadQueue.splice(0, this.batchSize)

      initialBatch.forEach(async (clip) => {
        await this.sleep(500)
        this.$nuxt.$emit('downloadClip', clip)
      })
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
