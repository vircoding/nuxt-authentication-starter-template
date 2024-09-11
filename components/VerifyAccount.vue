<script setup lang="ts">
const { resendVerificationEmail } = useAuth()

const timer1 = useTimer(10)

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
  <div class="container">
    Verify your account...
    <button @click="onResend">
      Reenviar email...
    </button>
  </div>
  <Timer :timer="timer1" />
  <button @click="timer1.start">
    Start
  </button>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: min-content;
  text-wrap: nowrap;
}
</style>
