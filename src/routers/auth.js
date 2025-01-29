import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { userRegisterController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { userValidationSchema } from '../validation/auth.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(userValidationSchema),
  ctrlWrapper(userRegisterController),
);
export default authRouter;
