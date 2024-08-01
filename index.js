const express = require("express");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectToDatabase } = require("./connection.js");
const routers = require("./routes/chat");
const socketConnection = require("./socket");
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const url = process.env.MongoDB_URL;
connectToDatabase(url);

app.use("/", routers);

const server = http.createServer(app);

socketConnection(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
