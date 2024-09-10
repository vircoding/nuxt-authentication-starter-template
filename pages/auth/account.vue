<script setup lang="ts">
const { update, logout } = useAuth()

const input = ref({
  username: useUserData().value.username || '',
})

async function onPassword() {
  console.warn('Change password')
}

async function onLogout() {
  try {
    await logout()
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}

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

    <div class="container">
      <!-- Update Form -->
      <form @submit.prevent="onSubmit">
        <input v-model="input.username" name="username" autocomplete="username" type="text" placeholder="Username">
        <button>Update</button>
      </form>

      <!-- CTA's -->
      <div class="cta-container">
        <!-- Logout -->
        <button @click="onLogout">
          Logout
        </button>

        <!-- Change Password -->
        <button @click="onPassword">
          Change Password
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cta-container {
  display: flex;
  gap: 10px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  width: 100%;
}
</style>
