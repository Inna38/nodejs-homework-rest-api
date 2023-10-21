const express = require("express");
const router = express.Router();

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

router.get("/", async (_, res, next) => {
  try {
    const results = await contacts.listContacts();
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const results = await contacts.getContactById(contactId);
    if (!results) {
      throw HttpError(404, "Not found");
    }
    res.json(results);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error)
  }
});



// router.delete("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

module.exports = router;
