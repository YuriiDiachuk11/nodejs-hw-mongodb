import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  userLoginController,
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
export default authRouter;
