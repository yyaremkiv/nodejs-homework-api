const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactsService");

const listContactsController = async (req, res) => {
  const { _id: userId } = req.user;
  let { page = 1, limit = 10, favorite } = req.query;
  const skip = parseInt((page - 1) * limit);
  limit = parseInt(limit) > 10 || parseInt(limit) < 0 ? 10 : parseInt(limit);

  const contacts = await listContacts(userId, { skip, limit, favorite });

  if (contacts.length === 0) {
    return res.status(200).json({ contacts, message: "User has no contacts" });
  }

  res.json({ contacts, message: "Success" });
};

const getContactByIdController = async (req, res) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const contact = await getContactById(contactId, userId);

  res.json({ contact, status: "Success" });
};

const addContactController = async (req, res, next) => {
  const { _id: owner } = req.user;
  const { name, email, phone, favorite } = req.body;

  const contact = await addContact({ name, email, phone, favorite, owner });

  res.status(201).json({ contact, status: "Success" });
};

const removeContactController = async (req, res, next) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;

  await removeContact(contactId, userId);

  res.status(200).json({ status: "Contact deleted" });
};

const updateContactController = async (req, res, next) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const { name, email, phone, favorite } = req.body;

  await updateContact(contactId, userId, { name, email, phone, favorite });

  res.status(200).json({ status: "Success" });
};

const updateContactStatusController = async (req, res, next) => {
  const { id: contactId } = req.params;
  const { _id: userId } = req.user;
  const { favorite } = req.body;

  if (!favorite) {
    res.status(400).json({ message: "Missing field favorite" });
  }

  const contact = await updateStatusContact(contactId, userId, { favorite });

  if (!contact) {
    res.status(404).json({ message: "Not found" });
  }

  res.status(200).json({ contact, status: "Success" });
};

module.exports = {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateContactStatusController,
};
