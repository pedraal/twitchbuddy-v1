<script setup lang="ts">
defineProps<{ to?: string }>()
</script>

<template>
  <UiButton icon="i-heroicons-chevron-left" variant="outline" :to="to || '/'">
    Back
  </UiButton>
</template>
