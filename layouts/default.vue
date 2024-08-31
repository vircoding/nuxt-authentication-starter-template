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
ul {
  display: flex;
  gap: 40px;
}
</style>
