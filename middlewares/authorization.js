"use strict";

const TaskRepository = require("../models").Task;

const authorization = async (req, res, next) => {
  try {
    const userId = req.session.id;

    await TaskRepository.findByPk(req.params.id).then((result) => {
      if (result === null) throw new Error("task not found");
      if (result.user_id !== userId) throw new Error("not authorized");
    });
    next();
  } catch (error) {
    if (error.message === "not authorized")
      return next({ status: 403, message: error.message });
    if (error.message === "task not found")
      return next({ status: 404, message: error.message });
  }
};

module.exports = authorization;
