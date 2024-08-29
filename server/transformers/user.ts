import type { User } from '@prisma/client';

export const userTransformer = ({ id, username, verified }: User) => {
  return { id, username, verified };
};
