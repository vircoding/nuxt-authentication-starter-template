export class FatalError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Fatal Error'
  }
}

export class AccessTokenExpiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Access Token Expired Error'
  }
}

export class InvalidAccessTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Invalid Access Token Error'
  }
}

export class RefreshTokenExpiredError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Refresh Token Expired Error'
  }
}

export class InvalidRefreshTokenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'Invalid Refresh Token Error'
  }
}
