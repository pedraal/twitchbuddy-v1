<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <section>
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
                :append-icon="false"
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
    </section>
    <section>
      <v-container>
        <v-row justify="center">
          <v-col v-for="collection in collections" :key="collection.id" :cols="12/collections.length">
            <h2 class="text-center">
              {{ collection.display_name }}
            </h2>
            <v-card
              v-for="video in collection.collection"
              :key="video.id"
              @click="selectedVideo && selectedVideo.id === video.id ? setSelected(null) : setSelected(video)"
              :class="{active: selectedVideo && selectedVideo.id === video.id} "
              class="my-2 pa-2"
              max-width="100%"
              outlined
            >
              <h5 class="caption">
                {{ video.title }}
              </h5>
              <p class="overline my-0">
                <v-icon small>
                  mdi-ray-start
                </v-icon>
                &nbsp;{{ humanDate(video.created_at) }}&nbsp;{{ humanTime(video.created_at) }}
              </p>
              <p class="overline my-0">
                <v-icon small>
                  mdi-ray-end
                </v-icon>
                &nbsp;{{ humanDate(video.ended_at) }}&nbsp;{{ humanTime(video.ended_at) }}
              </p>
              <p class="overline my-0">
                <v-icon small>
                  mdi-clock
                </v-icon>
                &nbsp;{{ video.duration }}
              </p>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <div v-if="selectedVideo" class="text-center">
        <v-btn @click="play" nuxt to="/player" outlined>
          Play
        </v-btn>
      </div>
    </section>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      select: []
    }
  },
  computed: {
    ...mapGetters('videos', ['collections', 'error', 'loading', 'selectedVideo']),
    filteredCollections () {
      if (this.selectedVideo) {
        return this.collections.map((collection) => {
          return {
            ...collection,
            collection: collection.collection.filter(video => moment(video.created_at).isBetween(moment(this.selectedVideo.created_at), moment(this.selectedVideo.ended_at), null, []) ||
            moment(video.ended_at).isBetween(moment(this.selectedVideo.created_at), moment(this.selectedVideo.ended_at), null, []) ||
            moment(this.selectedVideo.created_at).isBetween(moment(video.created_at), moment(video.ended_at), null, []) ||
            moment(this.selectedVideo.ended_at).isBetween(moment(video.created_at), moment(video.ended_at), null, []))
          }
        })
      }
      return []
    }
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
    },
    humanDate (val) {
      return moment(val).format('DD-MM-YYYY')
    },
    humanTime (val) {
      return moment(val).format('HH:mm:ss')
    },
    play () {
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }

  .v-card {
    h5 {
      white-space:nowrap;
      overflow: hidden;
      text-overflow:ellipsis;
    }

    &.active{
      background: #727272
    }
  }
</style>

<style lang="scss">
.v-autocomplete{
  .v-input__slot{
    min-height: 32px !important;
    height: 46px !important;
  }
}
</style>
