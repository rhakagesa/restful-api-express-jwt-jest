"use strict";

const UserService = require("../services/userService");

module.exports = class UserController {
  static async getAllUsers(req, res, next) {
    try {
      await UserService.findAllUsers().then((result) => {
        res.status(200).json(result);
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async getUser(req, res, next) {
    await UserService.findUser(req.session.id)
      .then((result) => {
        res.status(200).json({
          user: {
            name: result.name,
            email: result.email,
          },
        });
      })
      .catch((error) => {
        next({ status: 404, message: error.message });
      });
  }

  static async updateUser(req, res, next) {
    const data = {
      id: req.session.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    try {
      await UserService.update(data).then((result) => {
        res.status(200).json({ result, message: "user updated successfully" });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async deleteUser(req, res, next) {
    await UserService.delete(req.session.id)
      .then((result) => {
        res.status(200).json({ result, message: "user deleted successfully" });
      })
      .catch((error) => {
        next({ status: 404, message: error.message });
      });
  }
};
