const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../services/contactsService");

const listContactsController = async (req, res, next) => {
  const contacts = await listContacts();

  res.json({ contacts, status: "Success" });
};

const getContactByIdController = async (req, res, next) => {
  const contact = await getContactById(req.params.id);

  res.json({ contact, status: "Success" });
};

const addContactController = async (req, res, next) => {
  const { name, email, phone, favorite } = req.body;

  await addContact({ name, email, phone, favorite });

  res.status(201).json({ status: "Success" });
};

const removeContactController = async (req, res, next) => {
  await removeContact(req.params.id);

  res.status(200).json({ status: "Contact deleted" });
};

const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  await updateContact(id, { name, email, phone, favorite });

  res.status(200).json({ status: "Success" });
};

const updateContactStatusController = async (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (!favorite) {
    res.status(400).json({ message: "Missing field favorite" });
  }

  const contact = await updateStatusContact(id, { favorite });

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
