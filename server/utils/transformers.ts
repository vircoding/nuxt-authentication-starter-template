import type { User } from '@prisma/client'

export function userTransformer({ id, username }: User) {
  return { id, username }
}
