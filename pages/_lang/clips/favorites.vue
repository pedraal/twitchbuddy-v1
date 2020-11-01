<template>
  <v-container>
    <div class="d-flex justify-center align-start mb-4">
      <favorites-controls />
    </div>
    <clip-list
      :clips="favorites"
    />
    <div v-if="favorites.length === 0">
      <p class="overline text-center">
        {{ $t('clips.favorites.empty') }}
      </p>
    </div>
  </v-container>
</template>

<script>
import FavoritesControls from '@/components/clips/FavoritesControls'
import ClipList from '@/components/clips/ClipList'

export default {
  components: {
    FavoritesControls,
    ClipList
  },
  computed: {
    favorites () {
      return this.$store.state.api.user ? this.$store.getters['favorites/favorites'] : this.$store.getters['localStorage/favorites']
    }
  },
  beforeMount () {
    if (!this.$store.state.api.user) {
      this.$store.dispatch('localStorage/fetchLocalFavorites')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
