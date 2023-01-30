const express = require("express");
const router = express.Router();

const {
  addContactValidation,
} = require("../../middlewares/validationMiddleware");

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", listContacts);
router.get("/:id", getContactById);
router.post("/", addContactValidation, addContact);
router.put("/:id", addContactValidation, updateContact);
router.delete("/:id", removeContact);
module.exports = router;
