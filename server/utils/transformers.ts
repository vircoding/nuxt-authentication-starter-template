import type { User } from '@prisma/client'

export function userTransformer({ id, username, verified }: User) {
  return { id, username, verified }
}
