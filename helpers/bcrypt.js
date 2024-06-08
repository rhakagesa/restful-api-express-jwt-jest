const bcrypt = require("bcrypt");

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, 10);
  return hash;
};
const comparePassword = (hashPassword, password) => {
  const result = bcrypt.compareSync(password, hashPassword);
  return result;
};

module.exports = { hashPassword, comparePassword };
