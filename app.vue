<script setup lang="ts">
const sessionData = useSessionData()
const userData = useUserData()

const isMainContentVisible = computed(() => {
  return sessionData.value.isLoggedIn ? userData.value.verified : true
})
</script>

<template>
  <!-- Init Loading -->
  <InitLoading v-if="useInitLoading().value">
    Loading...
  </InitLoading>

  <!-- Main Content -->
  <div v-else>
    <NuxtLayout v-if="isMainContentVisible">
      <NuxtPage />
    </NuxtLayout>

    <VerifyAccount v-else />
  </div>
</template>
