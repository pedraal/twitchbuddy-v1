<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <div class="lists-nav">
          <v-btn @click="createList" text class="d-block justify-start mb-2">
            <v-icon class="mr-3">
              mdi-plus
            </v-icon>
            {{ $t('clips.lists.newList') }}
          </v-btn>
          <v-btn @click="selectedGroup = 'owned'" :class="{active: selectedGroup === 'owned'}" text class="d-block justify-start mb-2">
            <v-icon class="mr-3">
              mdi-account
            </v-icon>
            {{ $t('clips.lists.owned') }}
          </v-btn>
          <v-btn @click="selectedGroup = 'shared'" :class="{active: selectedGroup === 'shared'}" text class="d-block justify-start mb-2">
            <v-icon class="mr-3">
              mdi-account-group
            </v-icon>
            {{ $t('clips.lists.shared') }}
          </v-btn>
        </div>
      </v-col>
      <v-divider vertical />
      <v-col>
        <v-virtual-scroll
          :items="selectedLists"
          height="150"
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
        <div />
      </v-col>
    </v-row>
    <template v-if="selectedListId">
      <div class="mb-2 d-flex">
        <h3>
          {{ selectedList.name }}
        </h3>
        <v-spacer />
        <v-btn @click="deleteList" small class="mr-2">
          {{ $t('clips.lists.deleteList') }}
        </v-btn>
        <v-btn small>
          Download all
        </v-btn>
      </div>
      <clip-list
        :clips="selectedList.clips"
        :deletable="true"
      />
    </template>
  </v-container>
</template>

<script>
import ClipList from './ClipList'

export default {
  components: {
    ClipList
  },
  data: () => ({
    selectedGroup: 'owned',
    selectedListId: null
  }),
  computed: {
    selectedLists () {
      return this.$store.getters[`lists/${this.selectedGroup}Lists`]
    },
    selectedList () {
      return this.selectedLists.find(el => el._id === this.selectedListId)
    }
  },
  watch: {
    selectedGroup () {
      this.selectedListId = null
    }
  },
  mounted () {
    this.$store.dispatch('lists/fetchLists')
  },
  methods: {
    createList () {
      const listName = prompt(this.$t('clips.lists.createPrompt'))
      if (listName) {
        this.$store.dispatch('lists/createList', listName)
      }
    },
    downloadList () {

    },
    deleteList () {
      this.$store.dispatch('lists/deleteList', this.selectedListId)
      this.selectedListId = null
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

.v-list {
  background: none;

  .active {
    background: #222;
  }
}

</style>
