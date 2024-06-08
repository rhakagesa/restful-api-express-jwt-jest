"use strict";

const { veryfyToken } = require("../helpers/jwt");

const authentication = (req, res, next) => {
  try {
    const token = req.cookies["jwt"];
    if (!token) throw Error("must login first / token not found");

    const decode = veryfyToken(token);
    if (!decode) throw Error("token is not registered");
    req.session = decode;
    next();
  } catch (error) {
    next({ status: 401, message: error.message });
  }
};

module.exports = authentication;
