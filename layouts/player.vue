<template>
  <v-app>
    <nuxt />
    <client-only>
      <VueHandyGa class="foreground" />
    </client-only>
  </v-app>
</template>

<script>

export default {
}
</script>

<style lang="scss" scoped>
  .v-list-item .v-icon {
    text-shadow: -2px 3px #536DFE;
  }

  .foreground {
    position: fixed;
    z-index: 4;
  }
</style>
