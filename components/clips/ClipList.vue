<template>
  <div>
    <v-expansion-panels v-model="panel">
      <clip-list-item
        v-for="(clip,i) in clips"
        :key="i"
        :ref="i"
        :clip="clip"
        :active="panel === i"
      />
    </v-expansion-panels>
  </div>
</template>

<script>
import ClipListItem from './ClipListItem'

export default {
  components: {
    ClipListItem
  },
  props: {
    clips: { type: Array, default: () => [] }
  },
  data () {
    return {
      panel: null
    }
  },
  watch: {
    clips (val) {
      if (val.length > 0) {
        setTimeout(() => {
          this.$emit('loadOffset', this.$refs[val.length - 10][0].$el.offsetTop)
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
