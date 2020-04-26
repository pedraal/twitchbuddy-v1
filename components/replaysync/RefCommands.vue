<template>
  <div :style="gridTemplate" class="grid">
    <div v-for="(collection,id) in collections" :key="id" :id="'gridItem-'+(id+1)" class="gridItem">
      <v-btn :class="{ 'grey darken-1': hasSelection && collection.videos[0].id === selectedVideo.id}" @click="setSelected(collection.videos[0])" class="panel" small>
        {{ id+1 }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import gridTemplate from '@/mixins/gridTemplateMixin.js'

export default {
  mixins: [gridTemplate],
  computed: {
    ...mapGetters('videos', ['selectedVideo', 'hasSelection'])
  },
  methods: {
    ...mapActions('videos', ['setSelected'])
  }
}
</script>

<style lang="scss" scoped>
.grid {
  position: absolute;
  top: 60px;
  right: 10px;
  height: 75px;
  width: 84px;
  display: grid;
}

.gridItem {
  padding: 1px;
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

.panel {
  width: 100%;
  height: 100% !important;
  min-width: 10px !important;
}
</style>
