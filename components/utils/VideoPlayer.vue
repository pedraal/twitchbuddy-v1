<template>
  <v-responsive :aspect-ratio="16/9">
    <iframe
      v-if="active"
      :src="'https://clips.twitch.tv/embed?clip=' + slug + '&muted=false&autoplay=' + autoplay + '&parent=' + parentUrl"
      frameborder="0"
      scrolling="no"
      allowfullscreen="true"
    />
  </v-responsive>
</template>

<script>
export default {
  props: {
    slug: {
      type: String,
      default: ''
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      parentUrl: ''
    }
  },
  mounted () {
    this.parentUrl = window.location.host.includes('localhost') ? 'localhost' : window.location.host
  }
}
</script>

<style lang="scss" scoped>

iframe {
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #333;
}
</style>
