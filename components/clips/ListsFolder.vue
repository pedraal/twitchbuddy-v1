<template>
  <v-virtual-scroll
    :items="$store.getters['lists/folderLists']"
    height="170"
    item-height="50"
  >
    <template v-slot:default="{ item: list }">
      <v-list-item :input-value="selectedListId === list._id" :key="list._id" @click="selectedListId = list._id" link>
        <span class="text-truncate text-capitalize">
          {{ list.name }}
        </span>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script>
export default {
  computed: {
    selectedListId: {
      get () {
        return this.$store.state.lists.selectedListId
      },
      set (newId) {
        this.$store.dispatch('lists/setSelectedListId', newId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.v-list {
  background: none;

  .active {
    background: #222;
  }
}
</style>
