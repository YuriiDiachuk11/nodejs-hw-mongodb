import createError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const isValidId = async (req, res, next) => {
  const { contactId } = req.params;
  console.log(contactId);
  if (!isValidObjectId(contactId)) {
    return next(createError(400, 'Invalid contact ID'));
  }
  next();
};
