import { Router } from 'express';

import {
  createContactsController,
  getContactByIdController,
  getContactsController,
  patchContactsController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactsController));

contactsRouter.patch(
  '/contacts/:contactId',
  ctrlWrapper(patchContactsController),
);

export default contactsRouter;
