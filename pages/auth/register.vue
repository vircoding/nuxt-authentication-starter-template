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
    console.info('Register successfully')
  }
  catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div>
    <h1>Register</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="input.username" type="text" placeholder="Username">
      <input v-model="input.email" type="email" placeholder="Email">
      <input v-model="input.password" type="password" placeholder="Password">
      <input v-model="input.repassword" type="password" placeholder="Repassword">
      <button>Regiter</button>
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
