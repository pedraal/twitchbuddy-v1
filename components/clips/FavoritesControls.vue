<template>
  <div>
    <v-btn @click="$emit('download-all')" small class="mb-2 mb-md-0">
      {{ $t('clips.menu.favorites.download_all') }}
    </v-btn>
    <v-btn @click="$store.dispatch('localStorage/emptyFavorites')" small class="">
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
