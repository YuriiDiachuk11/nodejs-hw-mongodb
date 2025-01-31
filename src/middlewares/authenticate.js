import createError from 'http-errors';
import { sessionCollection } from '../db/models/session.js';
import { usersCollection } from '../db/models/users.js';

export const authenticate = async (req, res, next) => {
  console.log('Request path:', req.path);
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createError(401, 'Please provide Authorization header'));
    return;
  }
  const bearer = authHeader.split(' ')[0];
  const token = authHeader.split(' ')[1];
  if (bearer !== 'Bearer' || !token) {
    next(createError(401, 'Auth header should be of type Bearer'));
    return;
  }
  console.log('Token received:', token);
  const session = await sessionCollection.findOne({ accessToken: token });
  if (!session) {
    next(createError(401, 'Session not found'));
    return;
  }
  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    console.log('Access token expired:', session.accessTokenValidUntil);
    return next(createError(401, 'Access token expired'));
  }
  const user = await usersCollection.findById(session.userId);

  if (!user) {
    console.log('User not found for session userId:', session.userId);
    return next(createError(401, 'User not found'));
  }
  console.log('Authenticated user:', user);
  req.user = user;

  next();
};
