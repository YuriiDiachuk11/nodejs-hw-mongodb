import { userRegister } from '../services/auth.js';

export const userRegisterController = async (req, res, next) => {
  const user = await userRegister(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
  next();
};
