import createError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({ page, perPage }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();
  const contactsCount = await ContactsCollection.countDocuments();
  const contacts = await contactsQuery.skip(skip).limit(limit).exec();
  const paginationData = calculatePaginationData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  try {
    const contact = await ContactsCollection.create(payload);
    return contact;
  } catch {
    throw createError(500, 'Creating a contact is failed');
  }
};

export const updateContact = async (contactId, payload) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId },
    { $set: payload },
    { new: true },
  );

  if (!result) {
    return null;
  }

  return result;
};
export const deleteContact = async (contactId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
