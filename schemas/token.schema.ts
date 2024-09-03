import { z } from 'zod'

// Refresh token
export const refreshTokenSchema = z.string()

// { code: string, sessionId: string, userId: string }
export const decodedRefreshTokenSchema = z.object({
  code: z.string(),
  sessionId: z.string(),
  userId: z.string(),
})

// Verification token
export const verificationTokenSchema = z.string()

export const decodedVerificationTokenSchema = z.object({
  code: z.string(),
  verificationCodeId: z.string(),
  userId: z.string(),
})
