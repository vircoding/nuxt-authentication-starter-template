<script setup lang="ts">
const userState = useUser()

const isMainContentVisible = computed(() => {
  return userState.value ? userState.value.verified : true
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
