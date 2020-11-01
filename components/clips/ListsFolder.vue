<template>
  <v-virtual-scroll
    :items="$store.getters['lists/folderLists']"
    :height="$store.getters['lists/folderLists'].length < 3 ? $store.getters['lists/folderLists'].length * 55 : 170"
    item-height="50"
  >
    <template v-slot:default="{ item: list, index }">
      <v-list-item :input-value="selectedListId === list._id" :key="list._id" @click="selectedListId = list._id" link dense>
        <span class="text-truncate">
          {{ index + 1 }}. {{ list.name }}
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
