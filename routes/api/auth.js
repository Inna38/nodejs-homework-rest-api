const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getCurrent,
  logout,
  patchSubscription,
} = require("../../controllers/auth");

const { authenticate } = require("../../middlewares");

router.post("/users/register", register);
router.post("/users/login", login);
router.get("/users/current", authenticate, getCurrent);
router.post("/users/logout", authenticate, logout);
router.patch("/users/subscription", authenticate,  patchSubscription)

module.exports = router;
