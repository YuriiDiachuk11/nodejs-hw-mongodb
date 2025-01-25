import createError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = async (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    throw createError(400, 'Invalid contact ID');
  }
  next();
};
