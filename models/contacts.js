const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("./models/contacts.json");

const getAllContacts = async () => {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
};

const setAllContacts = async (contacts) => {
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
};

const listContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(404).json({
      status: "The resource can not be found. Please try again later",
    });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contacts = await getAllContacts();
    const [contact] = contacts.filter((contact) => contact.id === id);

    if (!contact) {
      return res.status(404).json({
        status: `Failure, no contact with id ${id}`,
      });
    }

    res.status(200).json(contact);
  } catch (err) {
    res.status(404).json({
      status: "The resource can not be found. Please try again later",
    });
  }
};

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contacts = await getAllContacts();

    if (
      contacts.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      return res.status(404).json({
        status: `Сontact with the same name ${name} already exists!`,
      });
    }

    const newContact = {
      id: nanoid(),
      name,
      email,
      phone,
    };

    setAllContacts([...contacts, newContact]);

    res.status(201).json({ ...newContact });
  } catch (error) {
    res.status(404).json({
      status: "The resource can not be found. Please try again later",
    });
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    const newContacts = contacts.filter(
      (contact) => contact.id !== req.params.id
    );

    if (contacts.length > newContacts.length) {
      await setAllContacts(newContacts);
      res.status(200).json({ status: "contact deleted" });
    } else {
      res.status(404).json({ status: "Not found" });
    }
  } catch (error) {
    res.status(404).json({
      status: "The resource can not be found. Please try again later",
    });
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const contacts = await getAllContacts();
    let updateContact = {};

    contacts.forEach((contact) => {
      if (contact.id === req.params.id) {
        contact.name = name;
        contact.email = email;
        contact.phone = phone;
        updateContact = contact;
      }
    });

    await setAllContacts(contacts);

    if (updateContact.name) {
      res.status(200).json({ updateContact });
    } else {
      res.status(404).json({ status: "Not found" });
    }
  } catch (error) {
    res.status(404).json({
      status: "The resource can not be found. Please try again later",
    });
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
