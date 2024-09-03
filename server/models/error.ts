export class CustomVerifiedError extends Error {
  name: string

  constructor(message: string) {
    super(message)
    this.name = 'Verified Error'
  }
}

export class CustomPasswordError extends Error {
  name: string
  constructor(message: string) {
    super(message)
    this.name = 'Password Error'
  }
}

export class CustomRefreshTokenError extends Error {
  name: string
  constructor(message: string) {
    super(message)
    this.name = 'Refresh Token Error'
  }
}
