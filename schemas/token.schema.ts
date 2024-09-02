import { z } from 'zod'

export const verificationTokenSchema = z.string()

// TODO: Improve this schema
export const decodedVerificationTokenSchema = z.object({
  code: z.string(),
  verificationCodeId: z.string(),
  userId: z.string(),
})
