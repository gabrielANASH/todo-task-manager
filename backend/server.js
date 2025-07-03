const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

require("./sockets/taskSocket")(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
