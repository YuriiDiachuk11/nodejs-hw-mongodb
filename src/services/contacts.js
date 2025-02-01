import createError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortOrder = SORT_ORDER.DESC,
  sortBy = 'name',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  console.log('Authenticated user:', userId);
  const mongoFilter = { userId };

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite !== undefined) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const contactsQuery = ContactsCollection.find(mongoFilter);
  const contactsCount = await ContactsCollection.countDocuments(mongoFilter);

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, page, perPage);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });
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

export const updateContact = async (contactId, payload, userId) => {
  const result = await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: payload },
    { new: true },
  );

  if (!result) {
    return null;
  }

  return result;
};
export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
