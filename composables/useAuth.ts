import type { z } from 'zod'
import type { loginSchema, registerSchema } from '~/schemas/user.schema'

type RegisterBody = z.infer<typeof registerSchema>
type LoginBody = z.infer<typeof loginSchema>

function register(body: RegisterBody) {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/register', {
      method: 'POST',
      body,
    }).then((data) => {
      useSetAccessToken(data.access_token)
      useSetUser(data.user)
      resolve(true)
    }).catch(error => reject(error))
  })
}

function login(body: LoginBody) {
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

function refresh() {
  return new Promise<true>((resolve, reject) => {
    $fetch('/api/auth/refresh', { method: 'POST' }).then((data) => {
      useSetAccessToken(data.access_token)
      resolve(true)
    }).catch(error => reject(error))
  })
}

export default function () {
  return { register, login, refresh }
}
