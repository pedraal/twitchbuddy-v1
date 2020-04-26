<template>
  <v-card class="wrapper">
    <template v-if="$route.name === 'clips'">
      <h4>Help</h4>
    </template>
    <template v-if="$route.name === 'replaysync'">
      <h4>Help</h4>
    </template>
  </v-card>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .wrapper {
    padding: 3rem;
  }
</style>
