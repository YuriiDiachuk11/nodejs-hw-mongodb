import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  console.log('Fetching contacts...');
  const contacts = await ContactsCollection.find();
  console.log('Contacts from DB:', contacts);
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};
