const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config()

const secretKey = process.env.JWT_SECRET_KEY;


const registerUser = async (email, password, User) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  return generateToken(email);
};

const authenticateUser = async (email, password, User) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  return generateToken(email);
};

const generateToken = (email) => {
  return jwt.sign({ email }, secretKey, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

module.exports = { registerUser, authenticateUser, verifyToken };
