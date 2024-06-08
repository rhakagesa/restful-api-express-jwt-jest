"use strict";

const { hashPassword } = require("../helpers/bcrypt");

const UserRepository = require("../models/").User;
const TaskRepository = require("../models").Task;

module.exports = class UserService {
  static async findAllUsers() {
    return await UserRepository.findAll();
  }

  static async findUser(id) {
    return await UserRepository.findByPk(id);
  }

  static async update(data) {
    const { id, name, email, password } = data;
    return await UserRepository.findByPk(id).then((user) => {
      if (!name || !email || !password) {
        throw new Error("name, email and password are required");
      } else {
        data.password = hashPassword(password);
        return user.update(data);
      }
    });
  }

  static async delete(id) {
    const user = await UserRepository.destroy({ where: { id } });
    const task = await TaskRepository.destroy({ where: { user_id: id } });

    if (user && task) return { user, task };

    return user;
  }
};
