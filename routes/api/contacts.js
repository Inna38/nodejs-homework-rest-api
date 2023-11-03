const express = require("express");
const router = express.Router();

const {isValidId, authenticate} = require("../../middlewares");


const {
  getContacts,
  getContactsById,
  postContacts,
  putContacts,
  patchContacts,
  deleteContacts,
  patchFavorite,
} = require("../../controllers/contacts");

router.get("/", authenticate, getContacts);

router.get("/:id", authenticate, isValidId, getContactsById);

router.post("/", authenticate, postContacts);

router.delete("/:id", authenticate, isValidId, deleteContacts);

router.put("/:id", authenticate,  isValidId, putContacts);

router.patch("/:id/favorite", authenticate, isValidId, patchContacts);

router.patch("/favorite", authenticate, patchFavorite);

module.exports = router;
