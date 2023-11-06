const express = require("express");
const router = express.Router();


const {
  register,
  login,
  getCurrent,
  logout,
  patchSubscription,
  patchAvatar,
} = require("../../controllers/auth");

const { authenticate, upload } = require("../../middlewares");


router.post("/users/register", register);
router.post("/users/login", login);
router.get("/users/current", authenticate, getCurrent);
router.post("/users/logout", authenticate, logout);
router.patch("/users/subscription", authenticate, patchSubscription)
router.patch("/users/avatars", authenticate, upload.single("avatar"), patchAvatar)

module.exports = router;