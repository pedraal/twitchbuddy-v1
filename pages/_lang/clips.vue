<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <section class="clip-form mb-4">
      <v-container>
        <clip-tabs :tab="tab" @tab="tab = $event" class="mb-8" />
        <clip-form v-if="tab === 'search'" />
      </v-container>
    </section>
    <section v-if="tab === 'lists'">
      <Lists />
    </section>
    <section v-else class="clip-list">
      <v-container>
        <div class="d-flex justify-center align-start">
          <favorites-controls v-if="tab === 'favorites' && filteredClips.length > 0" @download-all="downloadAll" />
        </div>
        <v-row>
          <v-col v-if="tab === 'search'" :class="clips.length > 0 || tab !== 'search' ? 'justify-start' : 'justify-center '" class="d-flex align-end">
            <tool-helper />
          </v-col>
          <template v-if="clips.length > 0 || tab !== 'search'">
            <v-spacer />
            <v-col cols="12" sm="6" md="4" class="d-flex justify-start align-end">
              <clip-filter
                v-if="filteredClips.length > 1"
                :value="filters"
                @input="(newFilters) => {filters = newFilters}"
              />
            </v-col>
          </template>
        </v-row>
        <clip-list
          ref="cliplist"
          :clips="filteredClips"
          @loadOffset="loadOffset = $event"
          class="cliplist"
        />
        <div v-if="tab === 'favorites' && filteredClips.length === 0">
          <p class="overline text-center">
            {{ $t('clips.favorites.empty') }}
          </p>
        </div>
      </v-container>
      <Loader />
    </section>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ClipTabs from '@/components/clips/ClipTabs'
import FavoritesControls from '@/components/clips/FavoritesControls'
import ClipForm from '@/components/clips/ClipForm'
import ClipFilter from '@/components/clips/ClipFilter'
import ClipList from '@/components/clips/ClipList'
import Loader from '@/components/utils/Loader'
import ToolHelper from '@/components/utils/ToolHelper'
import Lists from '@/components/clips/Lists'

export default {
  components: {
    ClipTabs,
    ClipForm,
    ClipFilter,
    FavoritesControls,
    ClipList,
    Lists,
    ToolHelper,
    Loader
  },
  data () {
    return {
      scrollValue: 0,
      loadOffset: 0,
      filters: {
        keyword: ''
      },
      tab: 'search'
    }
  },
  computed: {
    ...mapGetters('clips', ['clips', 'cursor']),
    filteredClips () {
      const clips = this.tab === 'search' ? this.clips : this.$store.getters['localStorage/favorites']
      if (this.filters.keyword.length < 2) {
        return clips
      }
      return clips.filter(item => item.category.toLowerCase().includes(this.filters.keyword.toLowerCase()) || item.title.toLowerCase().includes(this.filters.keyword.toLowerCase()) || item.creator_name.toLowerCase().includes(this.filters.keyword.toLowerCase()))
    }
  },
  watch: {
    scrollValue (val) {
      if (this.tab === 'search' && this.cursor && !this.$store.getters.loading && val > this.loadOffset) {
        this.loadClips()
      }
    },
    filteredClips (val) {
      if (this.clips.length === 0 || this.tab !== 'search') {
        return
      }
      if (this.cursor && !this.$store.getters.loading && val.length < 10) {
        this.loadClips()
      }
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
    this.$store.dispatch('localStorage/fetchLocalFavorites')
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
    this.setCursor('')
    this.emptyList()
  },
  methods: {
    ...mapActions('clips', ['loadClips', 'emptyList', 'setCursor']),
    handleScroll () {
      this.scrollValue = window.scrollY
    },
    downloadAll () {
      if (this.tab === 'search') return
      for (let i = 0; i < this.$store.getters['localStorage/favorites'].length; i++) {
        this.$refs.cliplist.$refs[i][0].download()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
</style>
