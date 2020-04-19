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
        <v-row justify="center">
          <v-col v-for="collection in collections" :key="collection.id" :cols="12/collections.length">
            <ReplayList :collection="collection" />
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
import { mapGetters } from 'vuex'

import ReplayForm from '@/components/replaysync/ReplayForm'
import ReplayList from '@/components/replaysync/ReplayList'

export default {
  components: {
    ReplayForm,
    ReplayList
  },
  computed: {
    ...mapGetters('videos', ['collections', 'selectedVideo'])
  }

}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
