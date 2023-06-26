<script setup lang="ts">
import { appName } from '~/config/constants'

const store = useMainStore()
await useLoadUser()

const dropdownItems = [
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: () => {
        return navigateTo('/api/auth/logout')
      },
    },
  ],
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <nav class="py-2">
      <UiContainer class="flex justify-between">
        <NuxtLink to="/" class="text-primary-400 text-xl font-semibold">
          {{ appName }}
        </NuxtLink>
        <div class="flex items-center gap-2">
          <ColorModeButton />
          <UiButton v-if="!store.user" to="/api/auth/login" target="_top">
            Login
          </UiButton>
          <template v-else>
            <UiDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }">
              <div class="flex items-center gap-2">
                <UiAvatar size="sm" :src="store.user.profile_image_url" />
                <span>{{ store.user.display_name }}</span>
              </div>
            </UiDropdown>
          </template>
        </div>
      </UiContainer>
    </nav>
    <main class="grow">
      <UiContainer>
        <slot />
      </UiContainer>
    </main>
    <footer class="pb-2 pt-8">
      <UiContainer>
        <p class="text-center">
          Bring with 🥖 by
          <a href="https://twitter.com/pedraaldev" target="_blank" rel="noopener noreferrer" class="text-primary-400 hover:text-primary-300 hover:underline">
            @pedraaldev
          </a>
        </p>
      </UiContainer>
    </footer>
  </div>
</template>
