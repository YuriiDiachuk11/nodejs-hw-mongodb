import createError from 'http-errors';
import { usersCollection } from '../db/models/users.js';
import bcrypt from 'bcrypt';
import { sessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { randomBytes } from 'crypto';
export const userRegister = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });
  if (user) {
    throw createError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  const newUser = await usersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
  return newUser;
};

export const userLogin = async (payload) => {
  const user = await usersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createError(404, 'User not found ');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createError(401, 'Unauthorized');
  }
  await sessionCollection.deleteOne({ userId: user._id });
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const session = await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  return session;
};
