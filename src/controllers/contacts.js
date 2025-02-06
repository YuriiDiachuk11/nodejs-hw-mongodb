import createError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const getContactsController = async (req, res, next) => {
  console.log('GET /contacts request received');
  try {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortOrder, sortBy } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);
    console.log('Authenticated user:', req.user);
    const contacts = await getAllContacts({
      page,
      perPage,
      sortBy,
      sortOrder,
      filter,
      userId: req.user._id,
    });
    console.log('Contacts fetched:', contacts);
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.data,
        page: contacts.page,
        perPage: contacts.perPage,
        totalItems: contacts.totalItems,
        totalPages: contacts.totalPages,
        hasNextPage: contacts.hasNextPage,
        hasPreviousPage: contacts.hasPreviousPage,
      },
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  console.log('User ID:', req.user._id);
  console.log('Contact ID:', contactId);
  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Contact with id ${contactId} successfully found!`,
    data: contact,
  });
};
export const createContactsController = async (req, res) => {
  const { photo } = req.file
    ? { photo: await saveFileToCloudinary(req.file) }
    : {};
  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    photo,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const patchContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const photo = req.file;
  let photoUrl;
  console.log('Received file:', photo);
  if (photo) {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const updateData = {
    ...req.body,
    photo: photoUrl,
  };

  const result = await updateContact(contactId, updateData, req.user._id);
  if (!result) {
    return next(createError(404, 'Contact not found'));
  }
  return res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  return res.status(204).send();
};
