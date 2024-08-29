# Nuxt Authentication Starter Template

This repository provides a starting point for building secure and robust authentication systems with Nuxt.js. It's designed to be a comprehensive template that includes all the necessary features for managing user accounts, from registration and login to password recovery and account verification via emails.

## Features

- **User management:**

  - Registration
  - Login
  - Session Persistence (Refresh Tokens)
  - Email Verification
  - Account Update
  - Account Deletion
  - Password Reset

- **Robust Security:**

  - Password Hashing (bcrypt)
  - JWT Authentication
  - Email Verification for Account Confirmation

- **Scalable Architecture:**
  - [Nuxt](https://nuxt.com/) as the full-stack framework
  - [Prisma](https://www.prisma.io/) as the ORM for managing the database
  - [MongoDB](https://www.mongodb.com/) as a non-relational database
  - [Nodemailer](https://nodemailer.com/) for sending emails
  - [Zod](https://zod.dev/) for data validation

## Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/vircoding/nuxt-authentication-starter-template.git
cd nuxt-authentication-starter-template
```

2. **Install dependencies:**

```bash
npm install
```

3. **Setup environment variables:**
   - **Create a .env file in the root directory** based on the .env.example file provided.
   - **Fill in the following environment variables:**

```
DATABASE_URL=<your-mongodb-url>
JWT_REFRESH_SECRET=<your-refresh-secret-key>
JWT_ACCESS_SECRET=<your-access-secret-key>
JWT_VERIFICATION_SECRET=<your-verification-secret-key>
EMAIL_HOST=<host-for-sending-emails>
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-email-password>
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Access the server:**
   The server will be available at http://localhost:3000.

## Usage

### Authentication

The API uses [JWTs](https://jwt.io/) for authentication. Access tokens are generated when a user logs in, and refresh tokens are used to obtain new access tokens when the access token expires.

### Email Verification

Email verification is handled using [Nodemailer](https://nodemailer.com/). When a new user is created, a verification email is sent to their email address.

### Data Validation

[Zod](https://zod.dev/) is used to validate user data. This helps ensure that data is in the correct format and meets the required constraints.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## Disclaimer

This template is intended to be a starting point to building a full-stack application. It is not intended to be a complete solution. You may need to modify the code and add additional features to meet your specific needs.

