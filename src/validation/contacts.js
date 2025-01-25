import Joi from 'joi';

export const createContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Name must be at least 3 characters long.',
    'string.max': 'Name cannot exceed 20 characters.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must start with +.',
    }),
  email: Joi.string()
    .email({
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .messages({
      'string.email': 'Email must be ending with .com or .net.',
    }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal', 'work'),
});

export const updateContactsSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().pattern(/^\+?[0-9]{10,15}$/),
  email: Joi.string().email({
    tlds: { allow: ['com', 'net'] },
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('home', 'personal', 'work'),
});
