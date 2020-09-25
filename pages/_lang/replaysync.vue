<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <section>
      <ReplayForm />
    </section>
    <section>
      <v-container>
        <div v-if="$store.state.videos.collections.length > 0">
          <v-timeline align-top dense>
            <v-timeline-item
              v-for="day in $store.getters['videos/calendar']"
              :key="day[0].toString()"
              color="#536dfe"
              small
            >
              <h3>{{ day[0] }}</h3>
              <v-container>
                <v-row>
                  <v-col
                    v-for="video in day[2]"
                    :key="video.id"
                    cols="12"
                    sm="6"
                    md="6"
                    lg="4"
                    class="py-0"
                  >
                    <ReplayListItem :video="video" :picture="video.channelPicture" />
                  </v-col>
                </v-row>
              </v-container>
              <div />
            </v-timeline-item>
          </v-timeline>
        </div>
        <ToolHelper v-else-if="$store.state.helpDisplay" class="left-border-primary" />
        <div v-if="referenceVideo" class="text-center">
          <v-btn @click="resetSelection" outlined>
            {{ $t('replaysync.reset') }}
          </v-btn>
          <v-btn @click="goToPlayer" outlined>
            {{ $t('replaysync.play') }}
          </v-btn>
        </div>
        <Loader />
      </v-container>
    </section>
  </v-layout>
</template>

<script>
import ReplayForm from '@/components/replaysync/ReplayForm'
import ReplayListItem from '@/components/replaysync/ReplayListItem'
import Loader from '@/components/utils/Loader'
import ToolHelper from '@/components/utils/ToolHelper'

export default {
  components: {
    ReplayForm,
    ReplayListItem,
    ToolHelper,
    Loader
  },
  computed: {
    referenceVideo () {
      return this.$store.getters['videos/referenceVideo']
    }
  },
  created () {
    this.$store.commit('SET_HELP_DISPLAY', true)
  },
  methods: {
    goToPlayer () {
      this.$store.commit('player/HARD_RESET_PLAYER')
      this.$store.commit('player/EMPTY_SLOTS')
      this.$store.commit('player/SET_REFERENCE_SLOT', this.$store.state.videos.selectedVideos[0].id)
      this.$store.state.videos.selectedVideos.forEach((v) => {
        this.$store.commit('player/ADD_SLOT', v)
      })
      this.$router.push('player')
    },
    resetSelection () {
      this.$store.commit('videos/RESET_SELECTED_VIDEOS')
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
