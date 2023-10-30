const Book = require("../models/contact");
const { HttpError } = require("../helpers");

const updateStatusContact = async (id, body) => {
  const result = await Book.Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  return result;
};


const getContacts = async (_, res) => {
  try {
    const results = await Book.Contact.find();
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getContactsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await Book.Contact.findById(id);
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
    const { error } = Book.schema.validate(req.body);
    if (error) {
      throw HttpError(
        400,
        `missing required ${error.message.split(" ", 1)} field`
      );
    }
    const result = await Book.Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContacts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Book.Contact.findByIdAndRemove(id);
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
    const { value } = Book.schema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    if (JSON.stringify(value) !== "{}") {
      const { error } = Book.schema.validate(req.body);
      if (error) {
        throw HttpError(
          400,
          `missing required ${error.message.split(" ", 1)} field`
        );
      }
    }

    const result = await updateStatusContact(id, req.body)
    
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
    const { value } = Book.updateFavoriteSchema.validate(req.body);

    if (JSON.stringify(value) === "{}") {
      res.status(400).json({ message: "Missing field favorite" });
      return;
    }

    const result = await updateStatusContact(id, req.body)

    if (!result) {
      HttpError(400, " Not found ");
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
  deleteContacts,
  putContacts,
  patchContacts,
};
