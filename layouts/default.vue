<script setup lang="ts">
const user = useUser()
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
          <li>
            <NuxtLink to="/auth/login">
              Login
            </NuxtLink>
          </li>

          <!-- Register -->
          <li>
            <NuxtLink to="/auth/register">
              Register
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- User -->
      <div v-if="user">
        <h4>User: {{ user.username }}</h4>
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
