<template>
  <div>
    <player-commands />
  </div>
</template>

<script>
import PlayerCommands from './PlayerCommands'
export default {
  components: {
    PlayerCommands
  },
  mounted () {
    window.appClock = setInterval(() => {
      this.$replayBus.$emit('ping')
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(window.appClock)
    window.appClock = null
  }
}
</script>

<style lang="scss" scoped>

</style>
