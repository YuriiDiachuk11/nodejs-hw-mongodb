import createError from 'http-errors';
import { THIRTY_DAYS } from '../constants/index.js';
import {
  userLogin,
  userRefreshSession,
  userRegister,
} from '../services/auth.js';

export const userRegisterController = async (req, res, next) => {
  const user = await userRegister(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
  next();
};

export const userLoginController = async (req, res, next) => {
  const session = await userLogin(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const userRefreshSessionController = async (req, res, next) => {
  const { sessionId, refreshToken } = req.cookies;
  if (!sessionId || !refreshToken) {
    throw createError(401, 'No refresh token');
  }
  const newSession = await userRefreshSession(sessionId, refreshToken);
  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};
