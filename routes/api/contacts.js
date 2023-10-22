const express = require("express");
const router = express.Router();

const { getContacts, getContactsById, postContacts, DeleteContacts, putContacts } = require("../../controllers/contacts");


router.get("/", getContacts);

router.get("/:contactId", getContactsById);

router.post("/", postContacts);

router.delete("/:contactId", DeleteContacts);

router.put("/:contactId", putContacts);

module.exports = router;
