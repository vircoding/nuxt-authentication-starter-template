import { FetchError } from 'ofetch'
import type { z } from 'zod'
import {
  AccessTokenExpiredError,
  FatalError,
  InvalidAccessTokenError,
  InvalidRefreshTokenError,
  RefreshTokenExpiredError,
} from '~/models/Error'
import type { loginSchema, registerSchema } from '~/schemas/user.schema'

type RegisterBody = z.infer<typeof registerSchema>
type LoginBody = z.infer<typeof loginSchema>

async function register(body: RegisterBody) {
  try {
    const data = await $fetch('/api/auth/register', { method: 'post', body })
    accessTokenState().value = data.access_token
    userState().value = data.user
  }
  catch (error) {
    if (error instanceof FetchError) {
      // TODO Handle Errors
      throw new FatalError('Unhadled error')
    }
    throw new FatalError('Unexpected error')
  }
}

async function login(body: LoginBody) {
  try {
    const data = await $fetch('/api/auth/login', { method: 'POST', body })
    accessTokenState().value = data.access_token
    userState().value = data.user
  }
  catch (error) {
    if (error instanceof FetchError) {
      // TODO Handle Errors
      throw new FatalError('Unhadled error')
    }
    throw new FatalError('Unexpected error')
  }
}

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    clearNuxtState('accessToken')
    clearNuxtState('user')
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new RefreshTokenExpiredError('The refresh token has expired')
        }
        else if (error.status === 400) {
          throw new InvalidRefreshTokenError('Refresh token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function refresh() {
  try {
    const data = await $fetch('/api/auth/refresh', { method: 'POST' })
    accessTokenState().value = data.access_token
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new RefreshTokenExpiredError('The refresh token has expired')
        }
        else if (error.status === 400) {
          throw new InvalidRefreshTokenError('Refresh token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function getUser() {
  try {
    const data = await $fetch('/api/auth', {
      headers: {
        Authorization: `Bearer ${accessTokenState().value}`,
      },
    })
    userState().value = data.user
  }
  catch (error) {
    if (error instanceof FetchError) {
      if (error.status !== undefined) {
        if (error.status === 401) {
          throw new AccessTokenExpiredError('The access token has expired')
        }
        else if ([400, 404].includes(error.status)) {
          throw new InvalidAccessTokenError('Access token error')
        }
      }
    }
    throw new FatalError('Unexpected error')
  }
}

async function init() {
  await refresh()
  await getUser().catch (() => {
    throw new FatalError('Unexpected error')
  })
}

export default function () {
  return { register, login, logout, refresh, getUser, init }
}
