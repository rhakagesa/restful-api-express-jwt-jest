"use strict";

const TaskRepository = require("../models").Task;

module.exports = class TaskService {
  static async createTask(data) {
    const { title, description, status, user_id } = data;
    if (!title || !description) {
      throw new Error("title and description are required");
    } else {
      return TaskRepository.create(data);
    }
  }

  static async getAllTask() {
    return await TaskRepository.findAll().then((tasks) => {
      if (tasks.length <= 0) {
        throw new Error("no tasks found");
      } else {
        return tasks;
      }
    });
  }

  static async getMyTask(id) {
    return await TaskRepository.findAll({ where: { user_id: id } }).then(
      (tasks) => {
        if (tasks.length <= 0) {
          throw new Error("no tasks found");
        } else {
          return tasks;
        }
      }
    );
  }

  static async getTask(id) {
    return await TaskRepository.findByPk(id).then((task) => {
      if (task === null) {
        throw new Error("task not found");
      } else {
        return task;
      }
    });
  }

  static async updateTask(data) {
    const { id, title, description, status, user_id } = data;
    return await TaskRepository.findByPk(id).then((result) => {
      if (result === null) {
        throw new Error("task not found");
      } else if (!title || !description) {
        throw new Error("title and description are required");
      } else {
        return TaskRepository.update(data, { where: { id } });
      }
    });
  }

  static async deleteTask(id) {
    return TaskRepository.destroy({ where: { id } });
  }
};
