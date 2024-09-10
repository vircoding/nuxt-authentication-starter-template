<script setup lang="ts">
const sessionData = useSessionData()
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
