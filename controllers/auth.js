const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  User,
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
} = require("../models/user");
const { HttpError } = require("../helpers");

const SECRET_KEY = `${process.env.SECRET_KEY}`;
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
      user: { email: result.email, subscription: result.subscription },
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
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token: token,
      user: { email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const patchSubscription = async (req, res, next) => {
  const { id } = req.user;
  const { email } = req.user;

  const { error } = updateSubscriptionSchema.validate(req.body);

  if (error) {
    res.status(400).json({ message: `${error.message} field` });
    return;
  }

  const result = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!result) {
    res.status(400).json({ message: " Not found " });
    return;
  }

  res.status(200).json({
    email,
    subscription: result.subscription,
  });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({ message: "No Content" });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  patchSubscription,
};
