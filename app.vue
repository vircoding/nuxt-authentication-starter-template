<script setup lang="ts">
import { FatalError } from '~/models/Error'

const { init } = useAuth()

const user = userState()

const isMainContentVisible = computed(() => {
  return user.value ? user.value.verified : true
})

onBeforeMount(async () => {
  try {
    await init()
  }
  catch (error) {
    if (error instanceof FatalError) {
      showError(error)
    }
  }
})
</script>

<template>
  <!-- Main Content -->
  <div v-if="isMainContentVisible">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <!-- Verify -->
  <VerifyAccount v-else />
</template>
