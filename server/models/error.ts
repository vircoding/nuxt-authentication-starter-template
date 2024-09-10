export class BodyError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Body Error'
  }
}

export class VerifiedError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Verified Error'
  }
}

export class PasswordError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Password Error'
  }
}

export class RefreshTokenError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Refresh Token Error'
  }
}

export class PasswordCodeError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Password Code Error'
  }
}
