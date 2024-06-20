"use strict";

const UserRepository = require("../models").User;
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

module.exports = class AuthService {
  static async loginUser(data) {
    const { email, password } = data;

    if (!email || !password) throw new Error("email and password are required");

    return await UserRepository.findOne({ where: { email: email } }).then(
      (user) => {
        if (user === null) {
          throw new Error("user not found");
        } else {
          if (comparePassword(user.password, password)) {
            const payload = {
              id: user.id,
              name: user.name,
              email: user.email,
            };

            const token = generateToken(payload);

            return { payload, token };
          } else {
            throw new Error("password is incorrect");
          }
        }
      }
    );
  }

  static async createUser(data) {
    const { name, email, password } = data;
    if (!name || !email || !password) {
      throw new Error("name, email and password are required");
    } else {
      return await UserRepository.findAll({ where: { email: email } }).then(
        (result) => {
          result.map((user) => {
            if (user.email === email) throw new Error("email already exist");
          });
          return UserRepository.create(data);
        }
      );
    }
  }

  static async logout(token) {
    return token.destroy();
  }
};
