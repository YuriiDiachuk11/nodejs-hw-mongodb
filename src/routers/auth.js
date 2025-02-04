import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  requestResetEmailController,
  resetPasswordController,
  userLoginController,
  userLogoutController,
  userRefreshSessionController,
  userRegisterController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  userValidationSchema,
} from '../validation/auth.js';

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
authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default authRouter;
