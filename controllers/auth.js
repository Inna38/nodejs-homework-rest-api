const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { nanoid } = require("nanoid");
const ElasticEmail = require("@elasticemail/elasticemail-client");
require("dotenv").config();

const {
  User,
  registerSchema,
  emailShema,
  loginSchema,
  updateSubscriptionSchema,
} = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");

const SECRET_KEY = `${process.env.SECRET_KEY}`;
const BASE_URL = `${process.env.BASE_URL}`;
const EMAIL_FROM = `${process.env.EMAIL_FROM}`;

const saltRounds = 10;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const verificationToken = nanoid();

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
    const avatarURL = gravatar.url(email);

    const result = await User.create({
      ...req.body,
      password: createHashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = ElasticEmail.EmailMessageData.constructFromObject({
      Recipients: [new ElasticEmail.EmailRecipient(`${email}`)],
      Content: {
        Body: [
          ElasticEmail.BodyPart.constructFromObject({
            ContentType: "HTML",
            Content: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Verify email</a>`,
          }),
        ],
        Subject: "Test email",
        From: EMAIL_FROM,
      },
    });

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: { email: result.email, subscription: result.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: "",
    verify: true,
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { error } = emailShema.validate(req.body);
  const { email } = req.body;

  if (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "Email not found" });
    return;
  }

  if (user.verify) {
    res.status(400).json({ message: "Verification has already been passed" });
    return;
  }

  const verifyEmail = ElasticEmail.EmailMessageData.constructFromObject({
    Recipients: [new ElasticEmail.EmailRecipient(`${email}`)],
    Content: {
      Body: [
        ElasticEmail.BodyPart.constructFromObject({
          ContentType: "HTML",
          Content: `<a href="${BASE_URL}/users/verify/${verificationToken}" target="_blank">Verify email</a>`,
        }),
      ],
      Subject: "Test email",
      From: EMAIL_FROM,
    },
  });

  await sendEmail(verifyEmail);

  res.status(200).json({
    message: "Verification email sent",
  });
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

    if (!user.verify) {
      throw HttpError(401, "Email not verify");
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

const patchAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    const image = await jimp.read(`public/${avatarURL}`);
    await image.resize(250, 250);
    await image.writeAsync(`public/${avatarURL}`);

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  patchSubscription,
  patchAvatar,
};
