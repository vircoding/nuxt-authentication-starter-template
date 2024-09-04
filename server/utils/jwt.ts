import jwt from 'jsonwebtoken'

const refreshSign = useRuntimeConfig().jwtRefreshSecret
const accessSign = useRuntimeConfig().jwtAccessSecret
const verificationSign = useRuntimeConfig().jwtVerificationSecret

// Refresh token
export function generateRefreshToken(payload: { code: string, sessionId: string, userId: string }) {
  return jwt.sign(payload, refreshSign, { expiresIn: '4h' })
}

export function decodeRefreshToken(token: string) {
  return jwt.verify(token, refreshSign)
}

// Access token
export function generateAccessToken(payload: { userId: string }) {
  return jwt.sign(payload, accessSign, { expiresIn: '10m' })
}

export function decodeAccessToken(token: string) {
  return jwt.verify(token, accessSign)
}

// Verification token
export function generateVerificationToken(payload: { code: string, verificationCodeId: string, userId: string }) {
  return jwt.sign(payload, verificationSign, { expiresIn: '5m' })
}

export function decodeVerificationToken(token: string) {
  return jwt.verify(token, verificationSign) || null
}
