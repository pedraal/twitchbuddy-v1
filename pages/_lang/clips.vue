<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <Nav class="mb-8" />
    <section>
      <nuxt-child />
    </section>
  </v-layout>
</template>

<script>
import Nav from '@/components/clips/Nav'

export default {
  key (route) {
    return route.fullPath
  },
  components: {
    Nav
  }
}
</script>

<style lang="scss" scoped>
section {
  width: 100%;
}
</style>
