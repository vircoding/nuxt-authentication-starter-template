import type { z } from 'zod'
import type { loginSchema, registerSchema } from '~/schemas/user.schema'

type RegisterBody = z.infer<typeof registerSchema>
type LoginBody = z.infer<typeof loginSchema>

export async function useLogin(body: LoginBody) {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/login', {
      method: 'POST',
      body,
    }).then((data) => {
      useSetAccessToken(data.access_token)
      useSetUser(data.user)
      resolve(true)
    }).catch(error => reject(error))
  })
}

export async function useRegister(body: RegisterBody) {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/register', {
      method: 'POST',
      body,
    }).then((data) => {
      useSetAccessToken(data.access_token)
      useSetUser(data.user)
      resolve(true)
    }).catch(error => reject(error),
    )
  })
}
