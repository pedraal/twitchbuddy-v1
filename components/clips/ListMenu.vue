<template>
  <div>
    <v-btn @click="$store.dispatch('lists/deleteList')" small class="mr-2">
      {{ $t('clips.lists.deleteList') }}
    </v-btn>
    <v-btn @click="$nuxt.$emit('downloadAll')" small>
      Download all
    </v-btn>
    <v-btn @click="removeAll" small>
      Empty list
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    removeAll () {
      const confirmResult = confirm(this.$t('clips.lists.remove_all_alert'))
      if (confirmResult) this.$store.dispatch('lists/emptyList')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
