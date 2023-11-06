const express = require("express");
const router = express.Router();
const multer = require('multer')

const path = require("path")

const tempDir = path.join(__dirname, "temp")

const multerConfig = multer.diskStorage({
  destination: tempDir,  
})

const upload = multer({
  storage: multerConfig
})

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
router.patch("/users/subscription", authenticate, patchSubscription)
router.patch("/users/avatars", authenticate, upload.single('avatar'), (req, res) => {
  console.log(req.body);
  console.log(req.file);
})

module.exports = router;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NDhiN2MyYjhiZmEwN2U2MWY2ZDE3YiIsImlhdCI6MTY5OTI2NDQ2MCwiZXhwIjoxNjk5MzQ3MjYwfQ.-rM6lQX8ROVE3md5IE5Ylk-KeudKtC8PQ-k6516YWJc