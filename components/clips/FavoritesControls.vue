<template>
  <div>
    <v-btn @click="$nuxt.$emit('downloadAll')" small>
      {{ $t('clips.menu.favorites.download_all') }}
    </v-btn>
    <v-btn @click="removeAll" small>
      {{ $t('clips.menu.favorites.remove_all') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    removeAll () {
      const confirmResult = confirm(this.$t('clips.menu.favorites.remove_all_alert'))
      if (confirmResult) this.$store.state.api.user ? this.$store.dispatch('favorites/emptyFavorites') : this.$store.dispatch('localStorage/emptyFavorites')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
