import { z } from 'zod'

// Refresh token
export const refreshTokenSchema = z.string()

export const decodedRefreshTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
})

// Access Token
export const accessTokenSchema = z.string()

export const decodedAccessTokenSchema = z.object({
  userId: z.string(),
})

// Verification token
export const verificationTokenSchema = z.string()

export const decodedVerificationTokenSchema = z.object({
  code: z.string(),
  id: z.string(),
  userId: z.string(),
})
