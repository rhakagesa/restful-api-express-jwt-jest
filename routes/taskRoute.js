"use strict";

const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/taskController");
const authorization = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

router.use(authentication);
router.post("/create", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/mytask", TaskController.getMyTask);
router.get("/:id", authorization, TaskController.getTask);
router.put("/update/:id", authorization, TaskController.updateTask);
router.delete("/delete/:id", authorization, TaskController.deleteTask);

module.exports = router;
