import { Router } from 'express';

import {
  getContactByIdController,
  getContactsController,
} from '../controllers/contacts.js';

const contactsRouter = Router();

contactsRouter.get('/contacts', async (req, res, next) => {
  getContactsController();
});

contactsRouter.get('/contacts/:contactId', async (req, res, next) => {
  getContactByIdController();
});

export default contactsRouter;
