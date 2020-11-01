<template>
  <div>
    <v-menu
      :close-on-click="true"
      bottom
      left
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          dark
        >
          {{ $t('clips.lists.menu') }}
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click.stop="showIdDialog = true" dense>
          <v-list-item-title>{{ $t('clips.lists.showId') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$nuxt.$emit('downloadAll')" dense>
          <v-list-item-title>{{ $t('clips.lists.downloadAll') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="rename" dense>
          <v-list-item-title>{{ $t('clips.lists.rename') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="removeAll" dense>
          <v-list-item-title>{{ $t('clips.lists.emptyList') }}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteList" dense>
          <v-list-item-title>{{ $t('clips.lists.deleteList') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="showIdDialog"
      max-width="400"
    >
      <v-card>
        <v-card-title class="headline">
          {{ $t('clips.lists.showIdDialogTitle') }}
        </v-card-title>
        <v-card-text class="body-1 pt-4">
          {{ $t('clips.lists.showIdDialog') }}
        </v-card-text>
        <v-card-text class="d-flex justify-center">
          <pre
            class="d-inline-block blue-grey darken-4 px-3 py-2"
          >{{ $store.state.lists.selectedListId }}</pre>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="showIdDialog = false"
            color="indigo accent-3"
            text
          >
            {{ $t('clips.lists.showIdDialogDone') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showIdDialog: false
    }
  },
  methods: {
    removeAll () {
      const confirmResult = confirm(this.$t('clips.lists.emptyListConfirm'))
      if (confirmResult) this.$store.dispatch('lists/emptyList')
    },
    deleteList () {
      const confirmResult = confirm(this.$t('clips.lists.deleteListConfirm'))
      if (confirmResult) this.$store.dispatch('lists/deleteList')
    },
    rename () {
      const listName = prompt(this.$t('clips.lists.renamePrompt'), this.$store.getters['lists/selectedList'].name)
      if (listName) {
        this.$store.dispatch('lists/renameList', listName)
      }
    },
    showId () {

    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  border-radius: 8px;
}
</style>
