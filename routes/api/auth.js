const express = require("express");
const router = express.Router();


const {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  getCurrent,
  logout,
  patchSubscription,
  patchAvatar,
} = require("../../controllers/auth");

const { authenticate, upload } = require("../../middlewares");


router.post("/users/register", register);
router.get("/users/verify/:verificationToken", verifyEmail)
router.post("/users/verify", resendVerifyEmail)
router.post("/users/login", login);
router.get("/users/current", authenticate, getCurrent);
router.post("/users/logout", authenticate, logout);
router.patch("/users/subscription", authenticate, patchSubscription)
router.patch("/users/avatars", authenticate, upload.single("avatar"), patchAvatar)

module.exports = router;