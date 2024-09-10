<script setup lang="ts">
const { logout } = useAuth()

const sessionData = useSessionData()

async function onLogout() {
  try {
    await logout()
  }
  catch (error) {
    if (error instanceof Error)
      showError(error)
  }
}
</script>

<template>
  <div>
    <header>
      <!-- Navbar -->
      <nav>
        <ul>
          <!-- Home -->
          <li>
            <NuxtLink to="/">
              Home
            </NuxtLink>
          </li>

          <!-- Login -->
          <li v-if="!sessionData.isLoggedIn">
            <NuxtLink to="/auth/login">
              Login
            </NuxtLink>
          </li>

          <!-- Register -->
          <li v-if="!sessionData.isLoggedIn">
            <NuxtLink to="/auth/register">
              Register
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- User -->
      <div v-if="sessionData.isLoggedIn">
        <NuxtLink to="/auth/account">
          My Account
        </NuxtLink>
      </div>
    </header>

    <!-- Logout -->
    <button v-if="sessionData.isLoggedIn" @click="onLogout">
      Logout
    </button>

    <!-- Content -->
    <slot />

    <!-- Footer -->
    <footer>
      <h5>Made by <a href="https://github.com/vircoding">@vircoding</a> 🍷🧐</h5>
    </footer>
  </div>
</template>

<style scoped>
header {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  display: flex;
  gap: 40px;
}
</style>
