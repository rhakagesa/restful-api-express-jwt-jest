"use strict";

const jwt = require("jsonwebtoken");
const secret = "rahasia";

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "60m" });
};

const veryfyToken = (token) => {
  return jwt.verify(token, secret);
};

module.exports = { generateToken, veryfyToken };
