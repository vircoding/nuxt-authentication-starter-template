<script lang="ts"></script>

<template>
  <div>
    <header>
      <!-- Navbar -->
      <nav>
        <ul>
          <!-- Home -->
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>

          <!-- Login -->
          <li>
            <NuxtLink to="/auth/login">Login</NuxtLink>
          </li>

          <!-- Register -->
          <li>
            <NuxtLink to="/auth/register">Register</NuxtLink>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Content -->
    <slot />
  </div>
</template>
