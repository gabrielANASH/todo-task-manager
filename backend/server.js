const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

// ✅ Connect MongoDB
connectDB();

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// ✅ Load socket events
require("./sockets/taskSocket")(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Allowed origin: ${process.env.CLIENT_URL}`);
});
