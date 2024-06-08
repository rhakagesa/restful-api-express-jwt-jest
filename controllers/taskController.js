"use strict";

const TaskService = require("../services/taskService");

module.exports = class TaskController {
  static async createTask(req, res, next) {
    const data = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || false,
      user_id: req.session.id,
    };
    try {
      await TaskService.createTask(data).then((result) => {
        res.status(201).json({ result, message: "task created successfully" });
      });
    } catch (error) {
      next({ status: 400, message: error.message });
    }
  }

  static async getAllTasks(req, res, next) {
    try {
      await TaskService.getAllTask().then((result) => {
        res.status(200).json({ result, message: "success" });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async getMyTask(req, res, next) {
    try {
      await TaskService.getMyTask(req.session.id).then((result) => {
        res.status(200).json({ result, message: "success" });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async getTask(req, res, next) {
    const id = req.params.id;
    try {
      await TaskService.getTask(id).then((result) => {
        res.status(200).json({ result, message: "success" });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async updateTask(req, res, next) {
    const data = {
      id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || false,
      user_id: req.session.id,
    };

    try {
      await TaskService.updateTask(data).then((result) => {
        res.status(200).json({ result, message: "task updated successfully" });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async deleteTask(req, res, next) {
    const id = req.params.id;
    try {
      await TaskService.deleteTask(id).then((result) => {
        res.status(200).json({ result, message: "task deleted successfully" });
      });
    } catch (error) {
      next({ status: 402, message: error.message });
    }
  }
};
