<script setup lang="ts">
const { login } = useAuth()

const input = ref({
  email: '',
  password: '',
})

async function onSubmit() {
  try {
    await login(input.value)
    navigateTo('/')
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}
</script>

<template>
  <div>
    <h1>Login</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="input.email" type="email" placeholder="Email">
      <input v-model="input.password" type="password" placeholder="Password">
      <button>Login</button>
    </form>
  </div>
</template>

<style scoped>
form {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
