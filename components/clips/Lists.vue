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
        <v-divider />
        <div>
          <v-list>
            <v-list-item :input-value="selectedListId === list._id" v-for="list in selectedLists" :key="list._id" @click="selectedListId = list._id" link>
              <span class="text-truncate text-capitalize">
                {{ list.name }}
              </span>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
      <v-divider vertical />
      <v-col>
        <template v-if="selectedListId">
          <h3>{{ selectedList.name }}</h3>
          <clip-list
            :clips="selectedList.clips"
          />
        </template>
      </v-col>
    </v-row>
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
    deleteList () {

    },
    downloadList () {

    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  min-height: 70vh;

  .col {
    height: 100%;
  }
}

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
