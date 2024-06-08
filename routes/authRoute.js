"use strict";

const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const authentication = require("../middlewares/authentication");

router.post("/login", AuthController.login);
router.post("/register", AuthController.registerUser);

router.use(authentication);
router.get("/logout", AuthController.logout);

module.exports = router;
