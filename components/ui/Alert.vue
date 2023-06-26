<script setup lang="ts">
const props = defineProps<{
  color?: 'primary' | 'red' | 'green' | 'yellow'
  icon?: string
}>()

const colors = {
  primary: 'bg-primary-400/10 text-primary-400',
  red: 'bg-red-400/10 text-red-400',
  green: 'bg-green-400/10 text-green-400',
  yellow: 'bg-yellow-400/10 text-yellow-400',
}
</script>

<template>
  <div class="flex items-center gap-4 rounded-lg p-4" :class="colors[props.color || 'red']">
    <UiIcon v-if="props.icon" :name="props.icon" class="h-8 w-8 text-xl" />
    <slot />
  </div>
</template>
