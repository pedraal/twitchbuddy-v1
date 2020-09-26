<template>
  <div
    class="text-center"
  >
    <v-progress-circular
      v-if="$store.getters.loading"
      class="ma-4"
      indeterminate
      size="50"
      color="indigo accent-3"
    />
  </div>
</template>
