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

export const userRefreshSession = async (sessionId, refreshToken) => {
  const session = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createError(401, 'Session token expired');
  }

  const newAccessToken = randomBytes(30).toString('base64');
  const newRefreshToken = randomBytes(30).toString('base64');

  const newSession = await sessionCollection.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  await sessionCollection.deleteOne({ _id: sessionId });
  return newSession;
};

export const userLogout = async (sessionId) => {
  const session = await sessionCollection.findOne({ _id: sessionId });
  if (!session) {
    throw createError(404, 'Session not found');
  }
  await sessionCollection.deleteOne({ _id: sessionId });
};
