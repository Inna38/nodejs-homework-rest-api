const Joi = require("joi");

const contacts = require("../models/contacts");
const { HttpError } = require("../helpers");

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const getContacts = async (_, res) => {
  try {
    const results = await contacts.listContacts();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getContactsById = async (req, res, next) => {
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
};

const postContacts = async (req, res, next) => {
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
};

const DeleteContacts = async (req, res, next) => {
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
};

const putContacts = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { value } = schema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
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
};

module.exports = {
  getContacts,
  getContactsById,
  postContacts,
  DeleteContacts,
  putContacts,
};
