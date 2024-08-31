import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z.string().min(3).max(10),
    email: z.string().email(),
    password: z.string().min(6).max(40),
    repassword: z.string(),
  })
  .refine(data => data.password === data.repassword, {
    message: 'Passwords do not match',
    path: ['repassword'],
  })

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(40),
})
