const socketIo = require("socket.io");
const User = require("./models/user");
const Message = require("./models/message");
const { verifyToken } = require("./middlewares/auth");

function socketConnection(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  const users = {};

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const user = verifyToken(token);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    const email = socket.user.email;
    users[socket.id] = email;

    await User.findOneAndUpdate({ email }, { socketId: socket.id });

    socket.broadcast.emit("user-connected", email);

    socket.on("message", (message) => {
      const newMessage = new Message({ name: users[socket.id], message });
      newMessage.save();
      socket.broadcast.emit("message", {
        message: message,
        name: users[socket.id],
      });
    });

    socket.on("disconnect", async () => {
      socket.broadcast.emit("user-disconnected", users[socket.id]);
      await User.findOneAndUpdate({ email }, { socketId: null });
      delete users[socket.id];
    });
  });
}

module.exports = socketConnection;
