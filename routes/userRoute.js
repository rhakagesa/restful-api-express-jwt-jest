"use strict";

const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");

router.use(authentication);
router.get("/", UserController.getAllUsers);
router.get("/info", UserController.getUser);
router.put("/update", UserController.updateUser);
router.delete("/delete", UserController.deleteUser);

module.exports = router;
