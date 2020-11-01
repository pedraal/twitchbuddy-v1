<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click.stop="dialog = true"
          v-bind="attrs"
          v-on="on"
          small
        >
          <v-icon>
            mdi-playlist-plus
          </v-icon>
        </v-btn>
      </template>
      <span> {{ $t('clips.lists.title') }}</span>
    </v-tooltip>
    <v-dialog
      :value="dialog"
      @click:outside="dialog = false"
      max-width="400"
    >
      <v-card class="pa-4">
        <v-card-title class="headline">
          {{ $t('clips.lists.title') }}
        </v-card-title>

        <v-card-actions class="px-3">
          <p class="mb-0">
            {{ $t('clips.lists.newList') }}
          </p>
          <v-spacer />
          <v-btn
            @click="newList"
            color="success"
            text
          >
            {{ $t('clips.lists.create') }}
          </v-btn>
        </v-card-actions>
        <v-divider v-if="$store.getters['lists/ownedLists'].length " />
        <v-card-actions v-for="list in $store.getters['lists/ownedLists']" :key="list._id" class="px-3">
          <p class="mb-0 text-capitalize text-truncate">
            {{ list.name }}
          </p>
          <v-spacer />
          <v-btn
            @click="addClip(list._id)"
            color="primary"
            text
          >
            {{ $t('clips.lists.add') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      top
      right
    >
      {{ $t('clips.lists.clipAdded') }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          @click.stop="snackbar = false"
          color="indigo accent-3"
          text
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: {
    clip: { type: Object, default: () => {} }
  },
  data () {
    return {
      dialog: false,
      snackbar: false
    }
  },
  watch: {
    dialog (newValue) {
      if (newValue) {
        this.$store.dispatch('lists/fetchLists')
      }
    }
  },
  methods: {
    async newList () {
      const listName = prompt(this.$t('clips.lists.createPrompt'))
      if (listName) {
        await this.$store.dispatch('lists/createList', listName)
      }
      await this.addClip(this.$store.getters['lists/ownedLists'].find(list => list.name === listName)._id)
    },
    async addClip (listId) {
      await this.$store.dispatch('lists/addClip', { listId, clip: this.clip })
      this.dialog = false
      this.snackbar = true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
