<template>
  <v-form @submit.prevent="submit">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="8"
          lg="5"
        >
          <v-combobox
            v-model="select"
            :items="select"
            append-icon=""
            label="Add channels"
            multiple
            chips
            small-chips
            deletable-chips
            hide-no-data
            hide-selected
            full-width
            clearable
          />
        </v-col>
        <v-col>
          <v-btn @click="submit" :disabled="loading" class="mt-4">
            submit
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      select: []
    }
  },
  computed: {
    ...mapGetters('videos', ['error', 'loading'])
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
    submit () {
      this.emptyError()
      this.emptyCollections()
      this.setSelected(null)
      this.getCollections(this.select.join(','))
    }
  }
}
</script>

<style lang="scss">
.v-input.v-autocomplete {
  .v-input__slot {
    min-height: 32px !important;
    height: 46px !important;
  }
  label {
    margin-top: -5px;
  }
}
</style>
