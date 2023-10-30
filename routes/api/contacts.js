const express = require("express");
const router = express.Router();

const isValidId = require("../../middlewares/isValidId");

const {
  getContacts,
  getContactsById,
  postContacts,
  putContacts,
  patchContacts,
  deleteContacts,
} = require("../../controllers/contacts");

router.get("/", getContacts);

router.get("/:id", isValidId, getContactsById);

router.post("/", postContacts);

router.delete("/:id", isValidId, deleteContacts);

router.put("/:id", isValidId, putContacts);

router.patch("/:id/favorite", isValidId, patchContacts);

module.exports = router;
