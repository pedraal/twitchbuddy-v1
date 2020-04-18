<template>
  <div>
    <div :style="gridTemplate" class="grid">
      <div
        v-for="(collection, id) in collections"
        :key="id"
        :id="'gridItem-'+(id+1)"
      >
        <client-only>
          <TwitchPlayer :video="collection.collection[0]" :ref="id" class="grid-item" />
        </client-only>
      </div>
    </div>
    <sync-controller @loading="loading=true" @ready="loading=false" />
    <transition name="fade">
      <div v-if="loading" class="loader d-flex justify-center align-center">
        <v-progress-circular
          :size="150"
          color="primary"
          indeterminate
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TwitchPlayer from '@/components/replaysync/TwitchPlayer'
import SyncController from '@/components/replaysync/SyncController'

import gridTemplate from '@/mixins/gridTemplateMixin.js'

export default {
  components: {
    TwitchPlayer,
    SyncController
  },
  mixins: [gridTemplate],
  layout: 'player',
  data () {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('videos', ['hasSelection'])

  },
  beforeMount () {
    if (!this.hasSelection) {
      window.location = '/replaysync'
    }
  }

}
</script>

<style lang="scss" scoped>
.grid {
  height: 100vh;
  width: 100%;
  display: grid;
}

#gridItem-1 {
  grid-area: gridItem1;
}

#gridItem-2 {
  grid-area: gridItem2;
}

#gridItem-3 {
  grid-area: gridItem3;
}

#gridItem-4 {
  grid-area: gridItem4;
}

.loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background-color: rgba(grey, 0.7);
}

</style>
