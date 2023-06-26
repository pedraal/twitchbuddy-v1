<script setup lang="ts">
import type { User } from '~/types'

defineProps<{ channel: User }>()
</script>

<template>
  <UiCard v-if="channel">
    <div class="flex items-center gap-2">
      <div>
        <UiAvatar size="3xl" :src="channel.profile_image_url" />
      </div>
      <div>
        <h1 class="flex items-center justify-between text-3xl font-bold">
          {{ channel.display_name }}

          <UiButton :to="`https://twitch.tv/${channel.login}`" target="_blank" variant="outline" icon="i-heroicons-arrow-top-right-on-square">
            View on Twitch
          </UiButton>
        </h1>
        <p>{{ channel.description }}</p>
      </div>
    </div>
  </UiCard>
</template>
