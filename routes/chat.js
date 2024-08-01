const express = require("express");
const router = express.Router();
const {handleCurrentUser, handleLogin, handleMessages, handleRegister} = require('../controllers/chat');

router.get("/messages", handleMessages);

router.post("/register", handleRegister);

router.get("/current-user", handleCurrentUser);

router.post("/login", handleLogin);

module.exports = router;
