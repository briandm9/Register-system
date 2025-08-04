const User = require('../models/user');
const bcrypt = require('bcrypt');

const createUser = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

module.exports = createUser;