<template>
  <v-container>
    <clip-form />
    <v-row>
      <v-col :class="clips.length > 0 ? 'justify-start' : 'justify-center '" class="d-flex align-end">
        <ClipDownloadQueue v-if="filteredClips.length > 0" :clips="filteredClips" class="mr-2" />
        <tool-helper />
      </v-col>

      <template v-if="clips.length > 0">
        <v-spacer />

        <v-col cols="12" sm="6" md="4">
          <clip-filter
            v-if="clips.length > 1"
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
    <Loader />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import ClipForm from '@/components/clips/ClipForm'
import ClipFilter from '@/components/clips/ClipFilter'
import ClipList from '@/components/clips/ClipList'
import ClipDownloadQueue from '@/components/clips/ClipDownloadQueue'
import Loader from '@/components/utils/Loader'
import ToolHelper from '@/components/utils/ToolHelper'

export default {
  components: {
    ClipForm,
    ClipFilter,
    ClipList,
    ClipDownloadQueue,
    ToolHelper,
    Loader
  },
  data () {
    return {
      scrollValue: 0,
      loadOffset: 0,
      filters: {
        keyword: ''
      }
    }
  },
  computed: {
    ...mapGetters('clips', ['clips', 'cursor']),
    filteredClips () {
      if (this.filters.keyword.length < 2) {
        return this.clips
      }
      return this.clips.filter(item => item.category.toLowerCase().includes(this.filters.keyword.toLowerCase()) || item.title.toLowerCase().includes(this.filters.keyword.toLowerCase()) || item.creator_name.toLowerCase().includes(this.filters.keyword.toLowerCase()))
    }
  },
  watch: {
    scrollValue (val) {
      if (this.cursor && !this.$store.getters.loading && val > this.loadOffset) {
        this.loadClips()
      }
    },
    filteredClips (val) {
      if (this.clips.length === 0) {
        return
      }
      if (this.cursor && !this.$store.getters.loading && val.length < 10) {
        this.loadClips()
      }
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
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
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
