const express = require("express");
const router = express.Router();

const {
  addContactValidation,
  updateContactStatusValidation,
} = require("../middlewares/validationMiddleware");

const { authMiddleware } = require("../middlewares/authMiddleware");
const { asyncWrapper } = require("../helpers/apiHelpers");

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateContactStatusController,
} = require("../controllers/contactsController");

router.use(authMiddleware);

router.get("/", asyncWrapper(listContactsController));
router.get("/:id", asyncWrapper(getContactByIdController));
router.post("/", addContactValidation, asyncWrapper(addContactController));
router.put("/:id", addContactValidation, asyncWrapper(updateContactController));
router.patch(
  "/:id/favorite",
  updateContactStatusValidation,
  asyncWrapper(updateContactStatusController)
);
router.delete("/:id", asyncWrapper(removeContactController));
module.exports = { contactsRouter: router };
