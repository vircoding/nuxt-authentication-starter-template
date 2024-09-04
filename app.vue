<script setup lang="ts">
const userState = useUser()
const { init } = useAuth()

const isMainContentVisible = computed(() => {
  return userState.value ? userState.value.verified : true
})

onBeforeMount(async () => {
  try {
    await init()
    console.info('Token refreshed')
  }
  catch (error) {
    console.error(error)
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
