import createError from 'http-errors';
import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  console.log('Contacts found:', contacts);
  return contacts;
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
    id: contactId,
  });
  return contact;
};
