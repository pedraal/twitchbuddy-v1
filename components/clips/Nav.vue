<template>
  <v-container class="d-flex justify-center">
    <v-btn-toggle
      borderless
      class="d-none d-md-block"
    >
      <v-btn small class="text-center" nuxt to="/clips/" exact>
        <span>{{ $t('clips.menu.tabs.search') }}</span>
        <v-icon right>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn small class="text-center" nuxt to="/clips/favorites">
        <span>{{ $t('clips.menu.tabs.favorites') }}</span>
        <v-icon right>
          mdi-star
        </v-icon>
      </v-btn>
      <v-btn v-if="$store.state.api.user !== null" small class="text-center" nuxt to="/clips/lists">
        <span>{{ $t('clips.menu.tabs.lists') }}</span>
        <v-icon right>
          mdi-format-list-bulleted
        </v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-btn-toggle
      borderless
      class="d-md-none"
    >
      <v-btn small nuxt to="/clips/" exact>
        <v-icon>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn small nuxt to="/clips/favorites">
        <v-icon>
          mdi-star
        </v-icon>
      </v-btn>
      <v-btn v-if="$store.state.api.user !== null" small nuxt to="/clips/lists">
        <v-icon>
          mdi-format-list-bulleted
        </v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-container>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      default: 'search'
    }
  }
}
</script>

<style lang="scss" scoped>
.text-center {
  min-width: 150px !important;
}

.d-md-none {
  .v-btn {
    min-width: 70px !important;
  }
}
</style>
