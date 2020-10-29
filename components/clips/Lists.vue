<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <ListsMenu />
      </v-col>
      <v-divider vertical />
      <v-col>
        <ListsFolder />
        <div />
      </v-col>
    </v-row>
    <template v-if="$store.state.lists.selectedListId">
      <div class="mb-2 d-flex">
        <h3>
          {{ $store.getters['lists/selectedList'].name }}
        </h3>
        <v-spacer />
        <ListMenu />
      </div>
      <clip-list
        :clips="$store.getters['lists/selectedList'].clips"
        :deletable="true"
      />
    </template>
  </v-container>
</template>

<script>
import ClipList from './ClipList'
import ListsFolder from './ListsFolder'
import ListsMenu from './ListsMenu'
import ListMenu from './ListMenu'

export default {
  components: {
    ClipList,
    ListsFolder,
    ListsMenu,
    ListMenu
  },
  mounted () {
    this.$store.dispatch('lists/fetchLists')
  }
}
</script>

<style lang="scss" scoped>

</style>
