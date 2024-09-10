<script setup lang="ts">
const { update } = useAuth()

const input = ref({
  username: useUserData().value.username || '',
})

async function onSubmit() {
  try {
    await update(input.value)
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}
</script>

<template>
  <div>
    <h1>Update</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="input.username" name="username" autocomplete="username" type="text" placeholder="Username">
      <button>Update</button>
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
