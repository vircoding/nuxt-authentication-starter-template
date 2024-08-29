import jwt from 'jsonwebtoken';

const refreshSign = useRuntimeConfig().jwtRefreshSecret;
const accessSign = useRuntimeConfig().jwtAccessSecret;
const verificationSign = useRuntimeConfig().jwtVerificationSecret;

export const generateRefreshToken = (payload: { uid: string }) => {
  return jwt.sign(payload, refreshSign, { expiresIn: '4h' });
};

export const generateAccessToken = (payload: { uid: string }) => {
  return jwt.sign(payload, accessSign, { expiresIn: '10m' });
};

export const generateVerificationToken = (payload: { uid: string; verificationCode: string }) => {
  return jwt.sign(payload, verificationSign, { expiresIn: '5m' });
};

export const decodeVerificationToken = (token: string) => {
  return jwt.verify(token, verificationSign) || null;
};

