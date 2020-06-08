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
        <Loader />
      </v-container>
      <div v-if="selectedVideo" class="text-center">
        <v-btn @click="goToPlayer" outlined>
          Play
        </v-btn>
      </div>
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
      this.$store.commit('player/SET_REFERENCE_SLOT', this.collections.filter(c => c.videos[0].id === this.selectedVideo.id)[0].id)
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
