<template>
  <v-form @submit.prevent="submit">
    <v-container>
      <v-row class="mt-2 mx-2">
        <v-col
          cols="12"
          md="8"
          lg="6"
          class="py-0"
        >
          <v-combobox
            v-model="select"
            :error="!!$store.state.videos.error"
            :label="$t('replaysync.form.label')"
            prepend-icon="mdi-account-group"
            append-icon=""
            multiple
            small-chips
            deletable-chips
            hide-no-data
            hide-selected
            clearable
          />
        </v-col>
        <v-col class="py-0">
          <v-btn @click="submit" :disabled="$store.getters.loading" class="mt-4">
            {{ $t('replaysync.form.submit') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data () {
    return {
      select: []
    }
  },
  computed: {
  },
  watch: {
    select (val) {
      if (val.length > 4) {
        this.$nextTick(() => this.select.pop())
      }
    }
  },
  beforeDestroy () {
    this.select = []
    this.$store.commit('videos/SET_ERROR', false)
  },
  methods: {
    submit () {
      this.$store.commit('videos/SET_ERROR', false)
      this.$store.commit('videos/EMPTY_COLLECTIONS')
      this.$store.dispatch('videos/fetchCollections', this.select.join(','))
    }
  }
}
</script>

<style lang="scss">

</style>
