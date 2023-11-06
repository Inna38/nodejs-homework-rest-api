const Contact = require("../models/contact");
const { HttpError } = require("../helpers");

const updateStatusContact = async (id, body) => {
  const result = await Contact.Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return result;
};

const getContacts = async (req, res) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const results = await Contact.Contact.find({ owner }, "", { skip, limit });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getContactsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await Contact.Contact.findById(id);
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
    const { _id: owner } = req.user;
    const { error } = Contact.schema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        `missing required ${error.message.split(" ", 1)} field`
      );
    }
    const result = await Contact.Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContacts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.Contact.findByIdAndRemove(id);
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
    const { id } = req.params;
    const { value } = Contact.schema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    if (JSON.stringify(value) !== "{}") {
      const { error } = Contact.schema.validate(req.body);
      if (error) {
        throw HttpError(
          400,
          `missing required ${error.message.split(" ", 1)} field`
        );
      }
    }

    const result = await updateStatusContact(id, req.body);

    if (!result) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const patchContacts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = Contact.updateFavoriteSchema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
      res.status(400).json({ message: "Missing field favorite" });
      return;
    }

    if (JSON.stringify(value) !== "{}") {
      const { error } = Contact.updateFavoriteSchema.validate(req.body);

      if (error) {
        throw HttpError(400, `${error.message} field`);
      }
    }

    const result = await updateStatusContact(id, req.body);

    if (!result) {
      throw HttpError(400, "Not found");
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const patchFavorite = async (req, res, next) => {
  const { favorite = true } = req.query;
  const result = await Contact.Contact.find({ favorite });

  res.json(result);
};

module.exports = {
  getContacts,
  getContactsById,
  postContacts,
  deleteContacts,
  putContacts,
  patchContacts,
  patchFavorite,
};
