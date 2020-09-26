<template>
  <div>
    <v-btn @click="$emit('download-all')" small>
      {{ $t('clips.menu.favorites.download_all') }}
    </v-btn>
    <v-btn @click="$store.dispatch('localStorage/emptyFavorites')" small>
      {{ $t('clips.menu.favorites.remove_all') }}
    </v-btn>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>
