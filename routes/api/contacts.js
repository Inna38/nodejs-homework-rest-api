const express = require("express");
const Joi = require("joi");
const router = express.Router();

const contacts = require("../../models/contacts");
const { HttpError } = require("../../helpers");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

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
    const { error } = schema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { value } = schema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
      console.log("ytuyu");
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    if (JSON.stringify(value) !== "{}") {
      const { error } = schema.validate(req.body);
      if (error) {
        throw HttpError(404, error.message);
      }
    }

    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
