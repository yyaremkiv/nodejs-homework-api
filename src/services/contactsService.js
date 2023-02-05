const { Contacts } = require("../../src/db/contactsModel");
const { WrongParametersError } = require("../helpers/errors");

const listContacts = async () => {
  const contacts = await Contacts.find({});
  return contacts;
};

const getContactById = async (id) => {
  const contact = Contacts.findById(id);

  if (!contact) {
    throw new WrongParametersError(`Failure, no contact with id ${id}`);
  }

  return contact;
};

const addContact = async ({ name, email, phone, favorite }) => {
  const contact = new Contacts({ name, email, phone, favorite });
  contact.save();
};

const removeContact = async (id) => {
  await Contacts.findByIdAndRemove(id);
};

const updateContact = async (id, { name, email, phone, favorite }) => {
  await Contacts.findByIdAndUpdate(id, {
    $set: { name, email, phone, favorite },
  });
};

const updateStatusContact = async (id, { favorite }) => {
  const contact = await Contacts.findByIdAndUpdate(
    id,
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
