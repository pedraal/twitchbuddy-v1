<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <h1>Replay Sync</h1>
    <section>
      <keep-alive>
        <v-form @submit.prevent="submit">
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="8"
              >
                <v-combobox
                  v-model="select"
                  :items="select"
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
            </v-row>
            <v-btn @click="submit" class="mr-4">
              submit
            </v-btn>
          </v-container>
        </v-form>
      </keep-alive>
    </section>
    <section>
      <div v-for="channel in channels" :key="channel.id">
        {{ channel.display_name }}
      </div>
    </section>
  </v-layout>
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
    ...mapGetters('videos', ['channels', 'error', 'cursor', 'loading'])
  },
  methods: {
    ...mapActions('videos', ['loadVideos', 'emptyCollections', 'emptyChannels', 'setCursor', 'emptyError']),
    submit () {
      this.setCursor('')
      this.emptyError()
      this.emptyCollections()
      this.emptyChannels()
      this.select.forEach(val => this.getVideos(val))
    },
    getVideos (channel) {
      this.loadVideos(channel)
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
