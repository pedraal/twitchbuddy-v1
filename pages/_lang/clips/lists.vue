<template>
  <v-container>
    <v-row class="mb-4 mb-md-0">
      <v-col cols="12" md="4">
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
        <h3 class="d-none d-md-block">
          {{ $store.getters['lists/selectedList'].name }}
        </h3>
        <v-spacer />
        <OwnedListMenu v-if="$store.state.lists.folder === 'ownedLists'" />
        <v-btn v-else @click="leaveList">
          {{ $t('clips.lists.leaveList') }}
        </v-btn>
      </div>
      <clip-list
        :clips="$store.getters['lists/selectedList'].clips"
        :deletable="$store.state.lists.folder === 'ownedLists'"
      />
    </template>
  </v-container>
</template>

<script>
import ClipList from '@/components/clips/ClipList'
import ListsFolder from '@/components/clips/ListsFolder'
import ListsMenu from '@/components/clips/ListsMenu'
import OwnedListMenu from '@/components/clips/OwnedListMenu'

export default {
  components: {
    ClipList,
    ListsFolder,
    ListsMenu,
    OwnedListMenu
  },
  mounted () {
    this.$store.dispatch('lists/fetchLists')
  },
  methods: {
    leaveList () {
      const confirmResult = confirm(this.$t('clips.lists.leaveListConfirm'))
      if (confirmResult) this.$store.dispatch('lists/leaveList')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
