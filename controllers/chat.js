const Message = require("../models/message");
const { registerUser, authenticateUser, verifyToken } = require("../middlewares/auth");
const User = require("../models/user");

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    const token = await authenticateUser(email, password, User);
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
}

async function handleRegister(req, res) {
  try {
    const { email, password } = req.body;
    const token = await registerUser(email, password, User);
    res.json({ token });
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: error.message });
  }
}

async function handleCurrentUser(req, res) {
  const token = req.headers["authorization"];
  try {
    const user = verifyToken(token);
    res.json({ name: user.email });
  } catch (error) {
    console.log(error);

    res.status(401).json({ error: "Unauthorized" });
  }
}

async function handleMessages(req, res) {
  const token = req.headers["authorization"];
  try {
    const user = verifyToken(token);
    if (!user) {
      throw new Error("User not found");
    }
    const messages = await Message.find({}).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = {handleCurrentUser, handleLogin, handleMessages, handleRegister};