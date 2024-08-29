import { prisma } from '.';

export const createRefreshToken = (data: { token: string; uid: string }) => {
  return prisma.refreshToken.create({ data }); // throws P2002 if token already exists
};
