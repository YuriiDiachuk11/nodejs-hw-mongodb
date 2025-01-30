import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userLoginController,
  userLogoutController,
  userRefreshSessionController,
  userRegisterController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserSchema, userValidationSchema } from '../validation/auth.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(userValidationSchema),
  ctrlWrapper(userRegisterController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(userLoginController),
);

authRouter.post('/refresh', ctrlWrapper(userRefreshSessionController));

authRouter.post('/logout', ctrlWrapper(userLogoutController));
export default authRouter;
