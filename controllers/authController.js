"use strict";

const AuthService = require("../services/authService");

module.exports = class AuthController {
  static async registerUser(req, res, next) {
    const formData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    try {
      await AuthService.createUser(formData).then((result) => {
        res.status(201).json({
          message: "user created successfully",
          data: result,
        });
      });
    } catch (error) {
      next({ status: 400, message: error.message });
    }
  }

  static async login(req, res, next) {
    const formData = {
      email: req.body.email,
      password: req.body.password,
    };

    try {
      await AuthService.loginUser(formData).then((result) => {
        res
          .cookie("jwt", result.token, {
            expire: new Date(Date.now() + 24 * 3600 * 1000),
            httpOnly: true,
          })
          .status(200)
          .json({
            message: "user logged in successfully",
            data: {
              user: {
                name: result.payload.name,
                email: result.payload.email,
              },
            },
          });
      });
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }

  static async logout(req, res, next) {
    try {
      await AuthService.logout(req.session).then(
        res
          .clearCookie("jwt")
          .status(200)
          .json({ message: "user logged out successfully" })
      );
    } catch (error) {
      next({ status: 404, message: error.message });
    }
  }
};
