<script setup lang="ts">
const { resendVerificationEmail } = useAuth()

async function onResend() {
  try {
    await resendVerificationEmail()
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}
</script>

<template>
  <div>
    Verify your account...
    <button @click="onResend">
      Reenviar email...
    </button>
  </div>
</template>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: min-content;
  text-wrap: nowrap;
}
</style>
