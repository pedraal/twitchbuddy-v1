<template>
  <div>
    <h1>Player</h1>
  </div>
</template>

<script>
export default {
  layout: 'player',
  head () {
    return {
      script: [
        { src: 'https://player.twitch.tv/js/embed/v1.js' }
      ]
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
