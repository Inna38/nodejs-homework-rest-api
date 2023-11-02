const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


const { User, registerSchema, loginSchema } = require("../models/user");
const { HttpError } = require("../helpers");


const SECRET_KEY = `${process.env. SECRET_KEY}`
const saltRounds = 10;

const register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    if (error) {
      throw HttpError(400, error.message);
    }

    const createHashPassword = await bcrypt.hash(password, saltRounds);

    const result = await User.create({
      ...req.body,
      password: createHashPassword,
    });

    res.status(201).json({
      email: result.email,
      subscription: result.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    const { email, password } = req.body;

    if (error) {
      throw HttpError(400, error.message);
    }

    const user = await User.findOne({ email });
    if (!user ) {
      throw HttpError(401, "Email or password is wrong");
    }


    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }

      const payload = {
         id: user._id,
      }
      
      const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"})
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDNmZjk1OWM5NjY1ZDNmZjMwNWI4YiIsImlhdCI6MTY5ODk1NTU5NSwiZXhwIjoxNjk5MDM4Mzk1fQ.P8ThmnqJ-kx3rY4YenUvtroCaWO13ErPs35wq1XC9Qg

      res.status(200).json({
      token,
      email,
      subscription: user.subscription,
    });
      
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
