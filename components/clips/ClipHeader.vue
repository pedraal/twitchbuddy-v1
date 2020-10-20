<template>
  <v-container class="d-flex justify-center">
    <v-btn-toggle
      @change="$emit('tab', $event)"
      :value="tab"
      borderless
      mandatory
    >
      <v-btn small value="search" class="text-center tab-btn">
        <span>{{ $t('clips.menu.tabs.search') }}</span>
        <v-icon right>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn small value="favorites" class="text-center tab-btn">
        <span>{{ $t('clips.menu.tabs.favorites') }}</span>
        <v-icon right>
          mdi-star
        </v-icon>
      </v-btn>
      <v-btn v-if="$store.state.api.user !== null" small value="lists" class="text-center tab-btn">
        <span>{{ $t('clips.menu.tabs.lists') }}</span>
        <v-icon right>
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
.tab-btn {
  min-width: 150px !important;
}
</style>
