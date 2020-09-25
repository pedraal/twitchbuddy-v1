<template>
  <v-container class="d-flex justify-center">
    <v-btn-toggle
      @change="$emit('tab', $event)"
      :value="tab"
      borderless
      mandatory
    >
      <v-btn value="search">
        <span>{{ $t('clips.menu.tabs.search') }}</span>
        <v-icon right>
          mdi-magnify
        </v-icon>
      </v-btn>
      <v-btn value="favorites">
        <span>{{ $t('clips.menu.tabs.favorites') }}</span>
        <v-icon right>
          mdi-star
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
