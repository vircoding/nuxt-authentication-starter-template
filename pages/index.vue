<script lang="ts"></script>

<template>
  <div>
    <h1>Home</h1>

    <!-- Hero -->
    <div>
      <p>
        This repository provides a starting point for building secure and robust authentication
        systems with Nuxt.js. It's designed to be a comprehensive template that includes all the
        necessary features for managing user accounts, from registration and login to password
        recovery and account verification via emails.
      </p>
    </div>

    <!-- Features -->
    <div>
      <h2>Features</h2>
      <ul>
        <!-- User Management -->
        <h3>User Management:</h3>
        <ul>
          <li>Registration</li>
          <li>Login</li>
          <li>Session Persistence (Refresh Tokens)</li>
          <li>Email Verification</li>
          <li>Account Update</li>
          <li>Account Deletion</li>
          <li>Password Reset</li>
        </ul>
      </ul>

      <!-- Robust Security -->
      <ul>
        <h3>Robust Security:</h3>
        <ul>
          <li>Password Hashing (bcrypt)</li>
          <li>JWT Authentication</li>
          <li>Email Verification for Account Confirmation</li>
        </ul>
      </ul>

      <!-- Scalable Architecture -->
      <ul>
        <h3>Scalable Architecture:</h3>
        <ul>
          <li><a href="https://nuxt.com/">Nuxt</a> as the full-stack framework</li>
          <li><a href="https://www.mongodb.com/">MongoDB</a> as a non-relational database</li>
          <li><a href="https://www.prisma.io/">Prisma</a> as the ORM for managing the database</li>
          <li><a href="https://nodemailer.com/">Nodemailer</a> for sending emails</li>
          <li><a href="https://zod.dev/">Zod</a> for data validation</li>
          <li><a href="https://handlebarsjs.com/">Handlebars</a> for dynamic templates</li>
        </ul>
      </ul>
    </div>

    <!-- Getting Started -->
    <div>
      <h2>Getting Started</h2>
      <p>
        Refer to the
        <a href="https://github.com/vircoding/nuxt-authentication-starter-template"
          >GitHub repository</a
        >
        for more details.
      </p>
    </div>

    <!-- License -->
    <div>
      <h2>License</h2>
      <p>
        This project is licensed under the MIT License. See the
        <a
          href="https://github.com/vircoding/nuxt-authentication-starter-template/blob/main/LICENSE"
          >License</a
        >
        file for more details.
      </p>
    </div>

    <!-- Contributions -->
    <div>
      <h2>Contributions</h2>
      <p>Contributions are welcome! Feel free to open an issue or submit a pull request.</p>
    </div>

    <!-- Disclaimer -->
    <div>
      <h2>Disclaimer</h2>
      <p>
        This template is intended to be a starting point to building a full-stack application. It is
        not intended to be a complete solution. You may need to modify the code and add additional
        features to meet your specific needs.
      </p>
    </div>
  </div>
</template>
