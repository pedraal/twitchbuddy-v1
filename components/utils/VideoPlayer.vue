<template>
  <div class="video-box">
    <div class="video-player mt-4">
      <iframe
        v-if="active"
        :src="'https://clips.twitch.tv/embed?clip=' + slug + '&muted=false&autoplay=' + autoplay + '&parent=twitchbuddy.app'"
        frameborder="0"
        scrolling="no"
        allowfullscreen="true"
      />
    </div>
  </div>
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
  }
}
</script>

<style lang="scss" scoped>
.video-box {
  margin: 2px;
  width: 100%;
}

.video-player {
  position: relative;
  border-radius: 5px;
  overflow: hidden;
  margin: 0 auto;
  width: 60%;
  background-color: rgba(black, 0.3);
}

@media screen and (max-width: 900px) {
  .video-player {
    width: 80%;
  }
}

@media screen and (max-width: 600px) {
  .video-player {
    width: 100%;
  }
}

.video-player::before {
  content: "";
  display: block;
  padding-top: 56.25%;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #333;
}
</style>
