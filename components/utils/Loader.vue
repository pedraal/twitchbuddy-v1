<template>
  <div
    class="text-center"
  >
    <v-progress-circular
      v-if="loading"
      class="ma-4"
      indeterminate
      color="primary"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('global', ['loading'])
  }
}
</script>
