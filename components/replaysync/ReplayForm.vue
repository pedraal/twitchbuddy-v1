<template>
  <v-form @submit.prevent="submit">
    <v-container>
      <v-card class="pa-4">
        <v-row class="mt-2 mx-2">
          <v-col
            cols="12"
            md="8"
            lg="5"
            class="py-0"
          >
            <v-combobox
              v-model="select"
              :error="!!error"
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
            <v-btn @click="submit" :disabled="loading" class="mt-4">
              {{ $t('replaysync.form.submit') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data () {
    return {
      select: ['camak']
    }
  },
  computed: {
    ...mapGetters('videos', ['error']),
    ...mapGetters('global', ['loading'])

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
    this.emptyError()
  },
  methods: {
    ...mapActions('videos', ['getCollections', 'emptyCollections', 'emptyError', 'setSelected']),
    ...mapMutations('global', ['setHelpDisplay']),
    submit () {
      this.setHelpDisplay(false)
      this.emptyError()
      this.emptyCollections()
      this.setSelected(null)
      this.getCollections(this.select.join(','))
    }
  }
}
</script>

<style lang="scss">

</style>
