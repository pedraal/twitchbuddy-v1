<template>
  <div class="lists-nav">
    <v-btn @click="createList" text class="d-block justify-start mb-2">
      <v-icon class="mr-3">
        mdi-plus
      </v-icon>
      {{ $t('clips.lists.newList') }}
    </v-btn>
    <v-btn @click="$store.dispatch('lists/setFolder', 'ownedLists')" :class="{active: $store.state.lists.folder === 'ownedLists'}" text class="d-block justify-start mb-2">
      <v-icon class="mr-3">
        mdi-account
      </v-icon>
      {{ $t('clips.lists.owned') }}
    </v-btn>
    <v-divider class="my-2" />
    <v-btn @click="joinList" text class="d-block justify-start mb-2">
      <v-icon class="mr-3">
        mdi-account-multiple-plus
      </v-icon>
      {{ $t('clips.lists.joinList') }}
    </v-btn>
    <v-btn @click="$store.dispatch('lists/setFolder', 'sharedLists')" :class="{active: $store.state.lists.folder === 'sharedLists'}" text class="d-block justify-start mb-2">
      <v-icon class="mr-3">
        mdi-account-group
      </v-icon>
      {{ $t('clips.lists.shared') }}
    </v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    createList () {
      const listName = prompt(this.$t('clips.lists.createPrompt'))
      if (listName) {
        this.$store.dispatch('lists/createList', listName)
      }
    },
    joinList () {
      const listId = prompt(this.$t('clips.lists.joinListPrompt'))
      if (listId) {
        this.$store.dispatch('lists/joinList', listId)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.lists-nav {
  .v-btn {
    width: 100%;

    &.active {
      background: #222;
    }
  }
}
</style>
