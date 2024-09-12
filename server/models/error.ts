export class BodyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Body Error'
  }
}

export class VerifiedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Verified Error'
  }
}

export class CredentialsError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Credentials Error'
  }
}

export class VerificationTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'VerificationTokenError'
  }
}

export class RefreshTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Refresh Token Error'
  }
}

export class PasswordCodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Password Code Error'
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Conflict Error'
  }
}
