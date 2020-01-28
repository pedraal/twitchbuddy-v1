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
      <v-container>
        <v-row>
          <v-col v-for="collection in collections" :key="collection.id">
            <h2 class="text-center">
              {{ collection.display_name }}
            </h2>
            <v-card
              v-for="video in selectedVideo ? timefilter(collection.collection) : collection.collection"
              :key="video.id"
              @click="selectedVideo && selectedVideo.id === video.id ? selectedVideo = null : selectedVideo = video"
              class="my-2"
              max-width="100%"
              outlined
            >
              <h5>{{ video.title }}</h5>
              <p>{{ video.created_at }}</p>
              <p>{{ video.duration }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      select: ['camak', 'hermanel', 'phoenie'],
      selectedVideo: null
    }
  },
  computed: {
    ...mapGetters('videos', ['collections', 'error', 'cursor', 'loading'])
  },
  methods: {
    ...mapActions('videos', ['getCollections', 'emptyCollections', 'emptyError']),
    submit () {
      this.emptyError()
      this.emptyCollections()
      this.getCollections(this.select.join(','))
    },
    timefilter (collection) {
      return collection.filter(video => moment(video.created_at).isBetween(moment(this.selectedVideo.created_at), moment(this.selectedVideo.ended_at), null, []) || moment(video.ended_at).isBetween(moment(this.selectedVideo.created_at), moment(this.selectedVideo.ended_at), null, []))
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
