<script setup lang="ts">
const { resendVerificationEmail } = useAuth()

const timer = useTimer(60)
timer.start()

const resendDisabled = ref(false)

async function onResend() {
  try {
    resendDisabled.value = true
    await resendVerificationEmail()
    timer.restart()
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}
</script>

<template>
  <div>
    <h2>Verify your account</h2>
    <p>We just sent you an email with instructions to verify your new account.</p>
    <div class="container">
      <button :disabled="timer.isRunning.value" @click="onResend">
        Resend email...
      </button>
      <Timer v-if="timer.isRunning.value" :timer="timer" />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 10px;
}

button {
  width: min-content;
  text-wrap: nowrap;
}
</style>
