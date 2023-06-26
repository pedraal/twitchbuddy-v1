<script setup>
defineProps({
  imgUrl: String,
  title: String,
})
</script>

<template>
  <div class="group relative overflow-hidden rounded-lg text-white" style="aspect-ratio: 16 / 9">
    <div v-if="imgUrl.startsWith('https://vod-secure.twitch.tv/_404/')" class="flex h-full w-full items-center justify-center bg-slate-400 dark:bg-slate-900">
      <UiIcon name="i-heroicons-film" class="text-5xl opacity-40" />
    </div>
    <img v-else :src="imgUrl" class="absolute inset-0 w-full" loading="lazy">
    <p class="absolute inset-x-1 top-1 truncate rounded bg-slate-900/80 px-1 py-0.5 text-sm group-hover:overflow-visible group-hover:whitespace-normal">
      {{ title }}
    </p>
    <p class="absolute bottom-1 left-1 truncate rounded bg-slate-900/80 px-1 py-0.5 text-sm">
      <slot name="bottomLeft" />
    </p>
    <p class="absolute bottom-1 right-1 truncate rounded bg-slate-900/80 px-1 py-0.5 text-sm">
      <slot name="bottomRight" />
    </p>
  </div>
</template>
