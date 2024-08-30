import jwt from 'jsonwebtoken'

const refreshSign = useRuntimeConfig().jwtRefreshSecret
const accessSign = useRuntimeConfig().jwtAccessSecret
const verificationSign = useRuntimeConfig().jwtVerificationSecret

export function generateRefreshToken(payload: { uid: string }) {
  return jwt.sign(payload, refreshSign, { expiresIn: '4h' })
}

export function generateAccessToken(payload: { uid: string }) {
  return jwt.sign(payload, accessSign, { expiresIn: '10m' })
}

export function generateVerificationToken(payload: { uid: string, verificationCode: string }) {
  return jwt.sign(payload, verificationSign, { expiresIn: '5m' })
}

export function decodeVerificationToken(token: string) {
  return jwt.verify(token, verificationSign) || null
}
