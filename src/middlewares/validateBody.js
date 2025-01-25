import createError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const error = createError(404, 'Bad request', {
      errors: err.details,
    });
    next(error);
  }
};
