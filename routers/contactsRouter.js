const express = require("express");
const router = express.Router();

const {
  addContactValidation,
  updateContactStatusValidation,
} = require("../src/middlewares/validationMiddleware");

const { asyncWrapper } = require("../src/helpers/apiHelpers");

const {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateContactStatusController,
} = require("../src/controllers/contactsController");

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
module.exports = router;
