const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Register user
router.post(
  "/register/users",
  authController.registerUser
);

// Login user
router.post(
  "/loginUser",
  authController.loginUser
);

module.exports = router;