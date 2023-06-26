<script setup lang="ts">
const store = useMainStore()
const router = useRouter()
const channelName = ref('')
</script>

<template>
  <div>
    <form v-if="store.user" class="flex items-end gap-3" @submit.prevent="router.push(`/channels/${channelName}`)">
      <UiFormGroup name="channel" label="Channel">
        <UiInput v-model="channelName" icon="i-heroicons-user" />
      </UiFormGroup>
      <div>
        <UiButton type="submit">
          Go
        </UiButton>
      </div>
    </form>
  </div>
</template>
