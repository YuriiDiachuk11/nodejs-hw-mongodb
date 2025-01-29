import createError from 'http-errors';
import { usersCollection } from '../db/models/users.js';
import bcrypt from 'bcrypt';
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
