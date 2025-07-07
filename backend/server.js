const http = require("http");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

// Load environment variables from .env
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");

// Connect to MongoDB
connectDB();

// Create server using Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Register socket handlers
require("./sockets/taskSocket")(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`🌐 Allowed origin: ${process.env.CLIENT_URL}`);
});
