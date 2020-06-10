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
        <v-row v-if="collections.length > 0" justify="center">
          <v-col v-for="collection in collections" :key="collection.id" :cols="12/collections.length">
            <ReplayList :collection="collection" />
          </v-col>
        </v-row>
        <ToolHelper v-else-if="helpDisplay" />
        <div v-if="selectedVideo" class="text-center">
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
import { mapGetters, mapMutations } from 'vuex'

import ReplayForm from '@/components/replaysync/ReplayForm'
import ReplayList from '@/components/replaysync/ReplayList'
import Loader from '@/components/utils/Loader'
import ToolHelper from '@/components/utils/ToolHelper'

export default {
  components: {
    ReplayForm,
    ReplayList,
    ToolHelper,
    Loader
  },
  computed: {
    ...mapGetters('videos', ['collections', 'selectedVideo']),
    ...mapGetters('global', ['helpDisplay'])
  },
  created () {
    this.setHelpDisplay(true)
  },
  methods: {
    ...mapMutations('global', ['setHelpDisplay']),
    goToPlayer () {
      this.$store.commit('player/HARD_RESET_PLAYER')
      this.$store.commit('player/EMPTY_SLOTS')
      const ref = this.collections.filter((c) => {
        if (c.videos.length === 0) {
          return false
        } else {
          return c.videos[0].id === this.selectedVideo.id
        }
      })[0]
      if (ref.length === 0) return
      this.$store.commit('player/SET_REFERENCE_SLOT', ref.id)
      this.$store.dispatch('player/buildSlots', this.collections)
      this.$router.push('player')
    }
  }

}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
