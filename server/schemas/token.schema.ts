import { z } from 'zod';

export const verificationTokenSchema = z.string();

// TODO: Improve this schema
export const decodedVerificationTokenSchema = z.object({
  uid: z.string(),
  verificationCode: z.string(),
});
