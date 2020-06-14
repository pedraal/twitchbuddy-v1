<template>
  <div>
    <nuxt />
    <client-only>
      <VueHandyGa class="foreground" />
    </client-only>
  </div>
</template>

<script>

export default {
  name: 'PlayerLayout'
}
</script>

<style lang="scss" scoped>
  .foreground {
    position: fixed;
    z-index: 4;
  }
</style>
