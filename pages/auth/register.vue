<script setup lang="ts">
const { register } = useAuth()

const input = ref({
  username: '',
  email: '',
  password: '',
  repassword: '',
})

async function onSubmit() {
  try {
    await register(input.value)
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
    <h1>Register</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="input.username" name="username" autocomplete="username" type="text" placeholder="Username">
      <input v-model="input.email" name="email" autocomplete="email" type="email" placeholder="Email">
      <input v-model="input.password" name="password" type="password" placeholder="Password">
      <input v-model="input.repassword" name="repassword" type="password" placeholder="Repassword">
      <button>Register</button>
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
