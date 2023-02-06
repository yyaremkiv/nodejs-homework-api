const { Contacts } = require("../../src/db/contactsModel");
const { WrongParametersError } = require("../helpers/errors");

const listContacts = async (userId, { skip, limit, favorite }) => {
  const contacts = await Contacts.find(
    favorite === undefined
      ? { owner: userId }
      : { owner: userId, favorite: favorite }
  )
    .select({
      __v: 0,
      owner: 0,
    })
    .skip(skip)
    .limit(limit);

  return contacts;
};

const getContactById = async (contactId, userId) => {
  const contact = await Contacts.findOne({ _id: contactId, owner: userId });
  if (!contact) {
    throw new WrongParametersError(`No contact with id ${contactId}`);
  }

  return contact;
};

const addContact = async ({ name, email, phone, favorite, owner }) => {
  const contact = new Contacts({ name, email, phone, favorite, owner });
  contact.save();

  return contact;
};

const removeContact = async (contactId, userId) => {
  await Contacts.findOneAndRemove({ _id: contactId, owner: userId });
};

const updateContact = async (
  contactId,
  userId,
  { name, email, phone, favorite }
) => {
  await Contacts.findOneAndUpdate(
    { _id: contactId, owner: userId },
    {
      $set: { name, email, phone, favorite },
    }
  );
};

const updateStatusContact = async (contactId, userId, { favorite }) => {
  const contact = await Contacts.findOneAndUpdate(
    { _id: contactId, owner: userId },
    {
      $set: { favorite },
    },
    { new: true }
  );

  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
